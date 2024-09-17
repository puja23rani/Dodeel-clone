const { LogoIcon } = require("../../../Assets/Index");

module.exports = [
  {
    key: "Lead",
    name: "Lead",
    icon: LogoIcon,
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
        icon: LogoIcon,
        badge: "Hot",
      },
      {
        key: "Log_Notes",
        name: "Log Notes",
        link: "/app/lead/log-notes",
        icon: LogoIcon,
        badge: "Hot",
      },
      {
        key: "Channel",
        name: "Channel",
        link: "/app/lead/Channel",
        icon: LogoIcon,
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
        icon: LogoIcon,
        link: "/app",
      },
      {
        key: "NewLead",
        name: "New Lead",
        icon: LogoIcon,
        link: "/app/dashboard/marketing",
      },
      {
        key: "Lead_Members",
        name: "Lead Members",
        icon: LogoIcon,
        link: "/app/dashboard/crypto",
      },
      
    ],
  },
  {
    key: "Recruitments",
    name: "Recruitments",
    icon: LogoIcon,
    child: [
      {
        key: "Custom_Question",
        name: "Custom Question",
        link: "/app/Custom_Question",
        icon: LogoIcon,
        badge: "Hot",
      },
      {
        key: "Interviewer",
        name: "Interviewer",
        link: "/app/Interviewer",
        icon: LogoIcon,
        badge: "Hot",
      },
      {
        key: "Job_Application",
        name: "Job Application",
        link: "/app/Job_Application",
        icon: LogoIcon,
        badge: "Hot",
      },
      // {
      //   key: "Log_Notes",
      //   name: "Log Notes",
      //   link: "/",
      //   icon: "business",
      //   badge: "Hot",
      // },
      
    ],
  },
];

