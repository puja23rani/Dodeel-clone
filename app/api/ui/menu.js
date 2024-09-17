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
        link: "/app/lead/channel",
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
        link: "/app/lead/campaign",
      },
      {
        key: "NewLead",
        name: "New Lead",
        icon: "settings_suggest",
        link: "/app/lead/new-lead",
      },
      {
        key: "Lead_Members",
        name: "Lead Members",
        icon: "settings_suggest",
        link: "/app/lead/lead-members",
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
        key: "Job_Create",
        name: "Job Create",
        link: "/app/Job_Create",
        icon: "settings_suggest",
        badge: "Hot",
      },
    ],
  },
];
