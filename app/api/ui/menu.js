module.exports = [
  {
    key: "Lead",
    name: "Lead",
    icon: "settings_suggest",
    child: [
      {
        key: "Lead_Settings",
        name: "Lead Settings",
        title: true,
      },
      {
        key: "Lead_Status",
        name: "Lead Status",
        link: "/app/lead/lead-status",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Log_Notes",
        name: "Log Notes",
        link: "/app/lead/log-notes",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Channel",
        name: "Channel",
        link: "/app/lead/Channel",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Lead_Management",
        name: "Lead Management",
        title: true,
      },
      {
        key: "Campaign",
        name: "Campaign",
        icon: "settings_suggest",
        link: "/app/lead/Campaign",
      },
      {
        key: "NewLead",
        name: "New Lead",
        icon: "settings_suggest",
        link: "/app/dashboard/marketing",
      },
      {
        key: "Lead_Members",
        name: "Lead Members",
        icon: "settings_suggest",
        link: "/app/dashboard/crypto",
      },
    ],
  },
  {
    key: "Recruitments",
    name: "Recruitments",
    icon: "settings_suggest",
    child: [
      {
        key: "Custom_Question",
        name: "Custom Question",
        link: "/app/Custom_Question",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Interviewer",
        name: "Interviewer",
        link: "/app/Interviewer",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Job_Application",
        name: "Job Application",
        link: "/app/Job_Application",
        icon: LogoIcon,
        badge: "Hot",
      },
    ],
  },
];

