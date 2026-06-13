import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Award,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { loginSchema } from "../../../schemas/auth.schema";
import type { LoginFormValues } from "../../../types/forms";
import { IsserLogo } from "../ui/IsserLogo";
import { ROLE_BASE_PATH } from "../../../types/user.types";
import { useLogin } from "../../../hooks";

// ─── Visuals ──────────────────────────────────────────────────────────────────

const PHOTOS = [
  "https://picsum.photos/seed/labscience/800/600",
  "https://picsum.photos/seed/university/800/600",
  "https://picsum.photos/seed/research99/800/600",
  "https://picsum.photos/seed/grantwork/800/600",
];

const GLASS = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(14px)",
  borderRadius: 16,
};

const GLASS_CARD_TEXT = { color: "rgba(255,255,255,0.95)" };
const GLASS_SUB = { color: "rgba(255,255,255,0.6)" };

function dashboardPathForRole(enumRole: string): string {
  const base = ROLE_BASE_PATH[enumRole] ?? "/login";
  return `${base}/dashboard`;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [loginError, setLoginError] = useState("");

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoginError("");
      try {
        const authUser = await login({
          email: values.email,
          password: values.password,
        });
        if (authUser) {
          navigate(dashboardPathForRole(authUser?.account_type ?? "/"), {
            replace: true,
          });
        } else {
          setLoginError("Invalid email or password. Please try again.");
        }
      } catch {
        setLoginError("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isSubmitting = formik.isSubmitting || loading;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <style>{`
        @keyframes float-a { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-16px) rotate(1deg)} }
        @keyframes float-b { 0%,100%{transform:translateY(0) rotate(1deg)}  50%{transform:translateY(-10px) rotate(-1deg)} }
        @keyframes float-c { 0%,100%{transform:translateY(0) rotate(0)}     50%{transform:translateY(-20px) rotate(1.5deg)} }
        @keyframes float-d { 0%,100%{transform:translateY(0) rotate(-0.5deg)} 50%{transform:translateY(-12px) rotate(0.5deg)} }
        @keyframes drift-in { from{opacity:0;transform:translateY(24px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes photo-zoom { from{transform:scale(1.08)} to{transform:scale(1)} }
        .card-a{animation:float-a 5s ease-in-out infinite}
        .card-b{animation:float-b 6s ease-in-out infinite 0.8s}
        .card-c{animation:float-c 7s ease-in-out infinite 1.6s}
        .card-d{animation:float-d 5.5s ease-in-out infinite 0.4s}
        .drift-in-1{animation:drift-in 0.6s ease-out 0.1s both}
        .drift-in-2{animation:drift-in 0.6s ease-out 0.3s both}
        .drift-in-3{animation:drift-in 0.6s ease-out 0.5s both}
        .drift-in-4{animation:drift-in 0.6s ease-out 0.7s both}
        .photo-zoom{animation:photo-zoom 1.2s ease-out both}
      `}</style>

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden h-full">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
          {PHOTOS.map((src, i) => (
            <div key={i} className="overflow-hidden relative min-h-0">
              <img
                src={src}
                alt=""
                className="photo-zoom w-full h-full object-cover block"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(26,51,99,0.92) 0%,rgba(18,40,80,0.88) 50%,rgba(26,51,99,0.94) 100%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="lgrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" />
        </svg>

        {/* Logo + headline */}
        <div className="relative">
          <div className="flex items-center mb-10">
            <IsserLogo height={100} />
          </div>
          <h1 className="font-black text-[34px] text-white leading-snug mb-3">
            Manage your
            <br />
            research grants
            <br />
            <span style={{ color: "#B79A64" }}>with precision.</span>
          </h1>
          <p
            className="text-[14px] leading-relaxed max-w-[360px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            A unified platform for the complete research grant lifecycle — from
            application to final reports.
          </p>
        </div>

        {/* Floating preview cards */}
        <div className="relative flex-1 my-8 min-h-[220px]">
          <div
            className="card-a drift-in-1 absolute"
            style={{
              ...GLASS,
              top: 0,
              left: 0,
              padding: "14px 16px",
              width: 230,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="flex items-center justify-center rounded-full shrink-0 size-[28px]"
                style={{ background: "rgba(34,197,94,0.25)" }}
              >
                <CheckCircle2 size={14} style={{ color: "#4ADE80" }} />
              </div>
              <div>
                <div className="font-bold text-xs" style={GLASS_CARD_TEXT}>
                  Proposal Approved
                </div>
                <div className="text-[10px]" style={GLASS_SUB}>
                  Just now
                </div>
              </div>
            </div>
            <div className="text-[11px] font-medium mb-2" style={GLASS_SUB}>
              Coastal Erosion Monitoring
            </div>
            <div className="flex items-center justify-between">
              <span
                className="font-mono font-bold text-xs"
                style={{ color: "#4ADE80" }}
              >
                GHS 180,000
              </span>
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: "rgba(34,197,94,0.2)", color: "#4ADE80" }}
              >
                Funded
              </span>
            </div>
          </div>

          <div
            className="card-b drift-in-2 absolute"
            style={{
              ...GLASS,
              top: 16,
              right: 0,
              padding: "14px 16px",
              width: 210,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center justify-center rounded-full shrink-0 size-[26px]"
                style={{ background: "rgba(183,154,100,0.3)" }}
              >
                <TrendingUp size={13} style={{ color: "#F0C674" }} />
              </div>
              <span className="font-bold text-xs" style={GLASS_CARD_TEXT}>
                Disbursement
              </span>
            </div>
            <div className="text-[11px] mb-1.5" style={GLASS_SUB}>
              Nanoparticle Research
            </div>
            <div
              className="rounded-full overflow-hidden mb-1.5 h-[5px]"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "65%",
                  background: "linear-gradient(to right,#60A5FA,#93C5FD)",
                }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[10px]" style={GLASS_SUB}>
                65% released
              </span>
              <span
                className="font-mono text-[10px] font-bold"
                style={GLASS_CARD_TEXT}
              >
                GHS 292k
              </span>
            </div>
          </div>

          <div
            className="card-c drift-in-3 absolute"
            style={{
              ...GLASS,
              bottom: 0,
              left: 20,
              padding: "14px 16px",
              width: 200,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex items-center justify-center rounded-full shrink-0 size-[26px]"
                style={{ background: "rgba(251,146,60,0.25)" }}
              >
                <Clock size={13} style={{ color: "#FB923C" }} />
              </div>
              <span className="font-bold text-xs" style={GLASS_CARD_TEXT}>
                Milestone Due
              </span>
            </div>
            <div
              className="text-[11px] font-medium mb-1"
              style={GLASS_CARD_TEXT}
            >
              Q2 Progress Report
            </div>
            <div className="text-[10px]" style={GLASS_SUB}>
              Predictive Diagnostics
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#FB923C" }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: "#FB923C" }}
              >
                3 days remaining
              </span>
            </div>
          </div>

          <div
            className="card-d drift-in-4 absolute"
            style={{
              ...GLASS,
              bottom: 10,
              right: 10,
              padding: "12px 16px",
              width: 160,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Award size={13} style={{ color: "#F0C674" }} />
              <span className="text-[10px] font-semibold" style={GLASS_SUB}>
                Approval Rate
              </span>
            </div>
            <div
              className="font-black text-[28px] leading-none"
              style={{ color: "#F0C674" }}
            >
              94%
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <svg width="40" height="16" viewBox="0 0 40 16">
                <polyline
                  points="0,14 8,10 16,12 24,6 32,8 40,2"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[9px]" style={{ color: "#4ADE80" }}>
                ↑ 4% this year
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative space-y-2">
          {[
            { stat: "247", label: "Research Projects Funded" },
            { stat: "GHS 12.4M", label: "Total Grants Awarded" },
            { stat: "94%", label: "Researcher Satisfaction" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="font-black text-[20px] min-w-[72px]"
                style={{ color: "#B79A64" }}
              >
                {item.stat}
              </span>
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8 lg:hidden">
            <IsserLogo height={38} />
          </div>

          <div className="mb-8">
            <h2 className="font-extrabold text-[26px] text-foreground leading-snug mb-1.5">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground">
              Use your institutional email to access the portal
            </p>
          </div>

          {loginError && (
            <div
              data-testid="login-error"
              className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] flex items-center gap-2"
            >
              <X size={14} className="flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block font-semibold text-[13px] text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                data-testid="email-input"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@institution.edu"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-card text-sm text-foreground border border-border focus:border-primary/50"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[13px] text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  data-testid="password-input"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl outline-none transition-all bg-card text-sm text-foreground border border-border focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ?
                    <EyeOff size={16} />
                  : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-testid="login-button"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all font-bold text-sm disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--primary), #2D6EA8)",
              }}
            >
              {isSubmitting ?
                "Signing in…"
              : <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              }
            </button>
          </form>

          {/* Forgot password */}
          <button
            onClick={() => setShowForgot(true)}
            className="mt-6 w-full text-center text-[13px] text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot your password?
          </button>

          {showForgot && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowForgot(false)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div
                className="relative w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowForgot(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
                {!forgotSent ?
                  <>
                    <h3 className="font-extrabold text-lg text-foreground mb-1">
                      Reset Password
                    </h3>
                    <p className="text-[13px] text-muted-foreground mb-4">
                      Enter your institutional email and we'll send a reset
                      link.
                    </p>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@institution.edu"
                      className="w-full px-4 py-3 rounded-xl outline-none bg-muted border border-border text-sm text-foreground mb-3"
                    />
                    <button
                      onClick={() => {
                        if (forgotEmail) setForgotSent(true);
                      }}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary), #2D6EA8)",
                      }}
                    >
                      Send Reset Link
                    </button>
                  </>
                : <div className="text-center py-4">
                    <CheckCircle2
                      size={40}
                      className="mx-auto mb-3 text-green-500"
                    />
                    <h3 className="font-extrabold text-lg text-foreground mb-2">
                      Email Sent!
                    </h3>
                    <p className="text-[13px] text-muted-foreground">
                      Check <strong>{forgotEmail}</strong> for the reset link.
                    </p>
                    <button
                      onClick={() => setShowForgot(false)}
                      className="mt-4 text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity"
                    >
                      Back to Login
                    </button>
                  </div>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
