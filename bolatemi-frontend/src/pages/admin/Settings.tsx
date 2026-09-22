import { FormEvent, useState } from "react";
import { api } from "../../lib/api";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/auth/change-password",
        { currentPassword, newPassword, confirmPassword },
        true,
      );

      setSuccess(response.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="page-heading admin-settings-heading">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>Settings</h1>
          <p className="admin-products-note">Manage your administrator password securely.</p>
        </div>
      </div>

      <div className="admin-settings-grid">
        <div className="admin-settings-card">
          <div className="admin-settings-card-heading">
            <div>
              <span className="eyebrow">SECURITY</span>
              <h2>Change Password</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              <span>Current password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <label>
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <small>Use at least 8 characters. A longer password is recommended.</small>
            </label>

            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {error && <div className="settings-message settings-message-error" role="alert">{error}</div>}
            {success && <div className="settings-message settings-message-success" role="status">{success}</div>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "CHANGING PASSWORD…" : "CHANGE PASSWORD"}
            </button>
          </form>
        </div>

        <aside className="admin-settings-card admin-settings-help">
          <span className="eyebrow">GOOD PRACTICE</span>
          <h2>Keep your account secure</h2>
          <ul>
            <li>Use a password you do not reuse on other websites.</li>
            <li>Never share your administrator password with staff or customers.</li>
            <li>After changing the initial password, do not keep the default password anywhere.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
