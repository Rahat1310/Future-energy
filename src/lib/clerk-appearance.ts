/** Shared Clerk UI theme aligned with project design tokens. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#1F6F4F",
    colorBackground: "#FFFFFF",
    colorText: "#1B2B22",
    colorTextSecondary: "#5B5F58",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#1B2B22",
    colorNeutral: "#5B5F58",
    borderRadius: "0.625rem",
    fontFamily: "var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    card: {
      backgroundColor: "#FFFFFF",
      boxShadow: "none",
      border: "1px solid #E8E6DD",
    },
    formButtonPrimary: {
      backgroundColor: "#1F6F4F",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#185A40",
      },
    },
    footerActionLink: {
      color: "#1F6F4F",
    },
    identityPreviewEditButton: {
      color: "#1F6F4F",
    },
  },
} as const;
