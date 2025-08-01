## 1. Philosophy

The project follows a _defense-in-depth_ approach:

1. **Least Privilege** – Every component (database, S3, Lambda / Next.js API route) receives only the permissions it needs.
2. **Zero Trust Networking** – Services are authenticated explicitly even when traffic stays inside AWS.
3. **Fail Closed** – Requests that do not satisfy an auth check, validation rule, or signature immediately receive `401 / 403` or `400` responses.
4. **Secrets as Configuration** – All credentials live exclusively in environment variables or secret managers; no keys are committed to Git.

---

## 2. Authentication & Authorization

### 2.1 Internal API Key

| Header              | Value                                        |
|---------------------|----------------------------------------------|
| `x-internal-api-key`| **Secret value stored in `INTERNAL_API_KEY`** |

* **Purpose** – Allows back-office tools, 3rd-party integrators, and staging scripts to call the serverless API endpoints without browser cookies or OAuth.
* **Enforcement points** – The key is verified in every sensitive route:
  * `app/api/surveys/route.ts`
  * `app/api/surveys/photos/route.ts`
  * `app/api/photos/[photoId]/route.ts`
* **Security note** – The key is *optional for same-origin browser requests*.  When the header is absent we assume the request originates from the first-party web app.  Any external caller **must** supply the key or receive `401 Unauthorized`.

### 2.2 Sessionless Design

All APIs are stateless.  No cookies or JWTs are stored; authentication is purely header-based.  This eliminates CSRF vectors and simplifies horizontal scaling.

---

## 3. Transport Layer Security

* **Public traffic** – The Next.js application is expected to run behind an ALB or Vercel edge that automatically enforces HTTPS (TLS 1.2+).
* **Database traffic** – PostgreSQL connections are created via `pg.Pool` with `ssl: { rejectUnauthorized: false }` (see `lib/db.ts`).  SSL encryption ensures credentials and PII are not sent in clear-text.  The loose certificate check enables AWS’ self-signed RDS certs; in production we pin RDS CA certs for stronger assurance.

---

## 4. Data at Rest

### 4.1 Amazon S3

* **Bucket** – Name provided by `AWS_S3_BUCKET` env var.
* **Encryption** – S3 default encryption should be enabled (SSE-S3 or SSE-KMS).  Client-side writes happen through the AWS SDK, which will inherit the bucket policy.
* **Access Control**
  * **Write** – The backend uploads files using an IAM user limited to `PutObject` on the bucket.
  * **Read** – Objects are created with `ACL: 'private'` (see `lib/aws.ts`).  No public read is allowed.
* **Distribution** – Front-end users access photos only through **time-bounded presigned URLs**.  These URLs expire after:
  * **Upload** presign: `15 min` (`expiresIn: 900` seconds)
  * **Download** presign: `60 min` (`expiresIn: 3600` seconds)
* **Object Lifecycle**
  * Temporary uploads are stored under `survey/tmp/`.  A nightly job can transition them to Glacier or delete after 30 days.

### 4.2 Amazon RDS (PostgreSQL)

| Control                        | Detail                                                      |
|--------------------------------|-------------------------------------------------------------|
| Storage Encryption             | Enabled by default using AWS KMS customer master key (CMK). |
| Network Isolation              | RDS instances reside in **private subnets**; only the app’s ECS / Lambda SG may connect. |
| Authentication                 | Password stored in AWS Secrets Manager & injected as `DATABASE_URL`. |
| TLS Enforcement                | Parameter group set to `rds.force_ssl = 1`; connections rejected unless SSL. |
| IAM Access                     | Only the deployment role may modify or snapshot the instance. |

---

## 5. Input Validation & Sanitization

* **Type Validation** – All API inputs are parsed into TypeScript interfaces (`SurveySubmission`, `PresignRequest`, etc.).
* **Schema Checks** – Email addresses are verified using a regex; S3 keys must start with `survey/tmp/`.
* **Parameterized SQL** – Every query uses `$1, $2…` placeholders via `pg`, eliminating SQL injection.

---

## 6. Secure Coding Practices

1. **Dependencies** – Dependabot alerts are enabled; `npm audit` runs in CI.
2. **Static Analysis** – ESLint + TypeScript strict mode catch unsafe casts.
3. **Logging** – Error logs avoid printing secrets; when `NODE_ENV !== 'development'`, detailed stack traces are withheld from HTTP responses.
4. **Secrets in Git** – `.env` and AWS credential files are excluded by `.gitignore`.

---

## 7. Infrastructure & Deployment

1. **CI/CD** – GitHub Actions deploys to preview/staging/prod via OIDC-based federation; no long-lived AWS keys live in GitHub.
2. **Environment Separation** – Each environment owns its own S3 bucket and RDS instance, preventing cross-environment data leaks.
3. **Terraform State** – (planned) stored in an encrypted S3 bucket with Dynamo DB final-lock.

---

## 8. Monitoring & Alerting

* **CloudWatch Alarms** – Trigger on 4xx/5xx surge, RDS CPU spikes, and S3 unauthorized access.
* **AWS GuardDuty** – Detects anomalous API actions (e.g., `GetObject` from unfamiliar IPs).
* **Audit Logs** – S3 server-access logging is piped to a centralized log bucket.  RDS exports Postgres logs to CloudWatch for retention.

---

## 9. Remaining Risks & TODOs

| Area              | Gap / Risk                                   | Planned Mitigation                        |
|-------------------|----------------------------------------------|-------------------------------------------|
| API Key Rotation  | Manual; no expiry                            | Automate rotation via AWS Secrets Manager |
| `rejectUnauthorized:false` | Accepts any RDS cert, MITM risk       | Bundle & pin AWS CA certs                 |
| DDoS              | No WAF configured                            | Add AWS WAF ACL w/ rate-based rules       |
| Temporary S3 Keys | Not moved to permanent location immediately  | Lambda to copy → delete temp on survey end|
