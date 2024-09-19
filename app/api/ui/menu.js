module.exports = [
  {
    key: "Dashboard",
    name: "Dashboard",
    link: "/app",
    icon: "dashboard",
    title: true
  },
  {
    key: "HRM",
    name: "HRM",
    icon: "room_preferences",
    child: [
      {
        key: "HRM_Management",
        name: "HRM Management",
        title: true,
      },
      {
        key: "Employee_Details",
        name: "Employee Details",
        link: "/app/hrm-setting/employee-details",
        icon: "settings_suggest",
      },
      {
        key: "Timesheet",
        name: "Timesheet",
        link: "/app/hrm-setting/designation",
        icon: "settings_suggest",
      },
      {
        key: "Attendance",
        name: "Attendance",
        link: "/app/hrm-setting/designation",
        icon: "settings_suggest",
      },
      {
        key: "Leave_Request",
        name: "Leave Request",
        link: "/app/hrm-setting/leave",
        icon: "settings_suggest",
      },
      {
        key: "Task",
        name: "Task",
        link: "/app/hrm-setting/allowance",
        icon: "settings_suggest",
      },
      {
        key: "Holidays",
        name: "Holidays",
        link: "/app/hrm-setting/performance",
        icon: "settings_suggest",
      },
      {
        key: "Payroll",
        name: "Payroll",
        link: "/app/hrm-setting/compentency-type",
        icon: "settings_suggest",
      },
      {
        key: "Appraisal",
        name: "Appraisal",
        link: "/app/hrm-setting/competenies",
        icon: "settings_suggest",
      },
      {
        key: "HRM_Settings",
        name: "HRM Settings",
        title: true,
      },
      {
        key: "Department",
        name: "Department",
        link: "/app/hrm-setting/department",
        icon: "settings_suggest",
      },
      {
        key: "Designation",
        name: "Designation",
        link: "/app/hrm-setting/designation",
        icon: "settings_suggest",
      },
      {
        key: "Leave",
        name: "Leave",
        link: "/app/hrm-setting/leave",
        icon: "settings_suggest",
      },
      {
        key: "Allowance",
        name: "Allowance",
        link: "/app/hrm-setting/allowance",
        icon: "settings_suggest",
      },
      {
        key: "Performance",
        name: "Performance",
        link: "/app/hrm-setting/performance",
        icon: "settings_suggest",
      },
      {
        key: "Compentency Type",
        name: "Compentency Type",
        link: "/app/hrm-setting/compentency-type",
        icon: "settings_suggest",
      },
      {
        key: "Competenies",
        name: "Competenies",
        link: "/app/hrm-setting/competenies",
        icon: "settings_suggest",
      },
      {
        key: "Office Shift",
        name: "Office Shift",
        link: "/app/hrm-setting/office-shift",
        icon: "settings_suggest",
      },
      {
        key: "contact-details",
        name: "Contact Details",
        link: "/app/hrm-setting/contact-details",
        icon: "settings_suggest",
      },

    ],
  },
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
      },
      {
        key: "Log_Notes",
        name: "Log Notes",
        link: "/app/lead/log-notes",
        icon: "settings_suggest",
      },
      {
        key: "Channel",
        name: "Channel",
        link: "/app/lead/channel",
        icon: "settings_suggest",
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
      },
      {
        key: "Interviewer",
        name: "Interviewer",
        link: "/app/Interviewer",
        icon: "settings_suggest",
      },
      {
        key: "Job_Application",
        name: "Job Application",
        link: "/app/Job_Application",
        icon: "settings_suggest",
      },
      {
        key: "applicantlist",
        name: "Applicant List",
        link: "/app/applicantlist",
        icon: "settings_suggest",
        badge: "Hot",
      },
    ],
  },
];
