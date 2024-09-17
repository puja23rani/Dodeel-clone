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
      // {
      //   key: "widgets",
      //   name: "Widgets",
      //   title: true,
      // },
      // {
      //   key: "infographics_widget",
      //   icon: "timelapse",
      //   name: "Infographics",
      //   link: "/app/widgets/infographics",
      // },
      // {
      //   key: "status_widget",
      //   icon: "nature_people",
      //   name: "Status",
      //   link: "/app/widgets/status",
      // },
      // {
      //   key: "analytics_widget",
      //   icon: "insert_chart",
      //   name: "Analytics",
      //   link: "/app/widgets/analytics",
      // },
      // {
      //   key: "mini_apps_widget",
      //   icon: "web",
      //   name: "Mini Apps",
      //   link: "/app/widgets/mini-apps",
      // },
      // {
      //   key: "gallery_widget",
      //   icon: "satellite",
      //   name: "Gallery",
      //   link: "/app/widgets/gallery-carousel",
      // },
      // {
      //   key: "material_font_icon",
      //   name: "Fonts & Icons",
      //   title: true,
      // },
      // {
      //   key: "typography",
      //   name: "Typography",
      //   icon: "font_download",
      //   link: "/app/ui/typography",
      // },
      // {
      //   key: "icons",
      //   name: "Material Icons",
      //   icon: "bookmark",
      //   link: "/app/ui/icons",
      // },
      // {
      //   key: "layouts",
      //   name: "Layouts",
      //   title: true,
      // },
      // {
      //   key: "grid",
      //   name: "Grid",
      //   icon: "view_column",
      //   link: "/app/layouts/grid",
      // },
      // {
      //   key: "application_layout",
      //   name: "App Layout",
      //   icon: "web",
      //   link: "/app/layouts/app-layout",
      // },
      // {
      //   key: "responsive",
      //   name: "Responsive",
      //   icon: "mobile_friendly",
      //   link: "/app/layouts/responsive",
      // },
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
        key: "Job_Create",
        name: "Job Create",
        link: "/app/Job_Create",
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

