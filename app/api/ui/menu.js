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
        link: "/app/hrm-setting/timeSheet",
        icon: "settings_suggest",
      },
      {
        key: "Attendance",
        name: "Attendance",
        link: "/app/hrm-setting/attendance",
        icon: "settings_suggest",
      },
      {
        key: "Leave_Request",
        name: "Leave Request",
        link: "/app/hrm-setting/leave-request",
        icon: "settings_suggest",
      },
      {
        key: "Task",
        name: "Task",
        link: "/app/hrm-setting/task",
        icon: "settings_suggest",
      },
      {
        key: "Holidays",
        name: "Holidays",
        link: "/app/hrm-setting/holidays",
        icon: "settings_suggest",
      },
      {
        key: "Payroll",
        name: "Payroll",
        link: "/app/hrm-setting/payroll",
        icon: "settings_suggest",
      },
      {
        key: "Appraisal",
        name: "Appraisal",
        link: "/app/hrm-setting/appraisal-list",
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

    ],
  },
  {
    key: "Sales",
    name: "Sales",
    icon: "settings_suggest",
    child: [

      {
        key: "Sales_Management",
        name: "Sales Management",
        title: true,
      },
      {
        key: "Customer",
        name: "Customer",
        icon: "settings_suggest",
        link: "/app/sales/customer",
      },
      {
        key: "Invoice",
        name: "Invoice",
        icon: "settings_suggest",
        link: "/app/sales/invoice",
      },
      {
        key: "Payments",
        name: "Payments",
        icon: "settings_suggest",
        link: "/app/sales/payments",
      },
      {
        key: "Project",
        name: "Project",
        icon: "settings_suggest",
        link: "/app/sales/project",
      },
      {
        key: "Proposal",
        name: "Proposal",
        icon: "settings_suggest",
        link: "/app/sales/proposal",
      },
      {
        key: "Sales_Settings",
        name: "Sales Settings",
        title: true,
      },
      {
        key: "Bill_Tax",
        name: "Bill Tax",
        link: "/app/sales/bill-tax",
        icon: "settings_suggest",

      },
      {
        key: "Integrations",
        name: "Integrations",
        title: true,
      },
      {
        key: "Facebook",
        name: "Facebook",
        link: "/app/sales/fb-login",
        icon: "settings_Facebook",

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
        icon: "settings_suggest",
        badge: "Hot",
      }
    ],
  },
  // Asset management
  {
    key: "Procurement",
    name: "Procurement",
    icon: "settings_suggest",
    child: [
      {
        key: "Requirement",
        name: "Requirement",
        link: "/app/requirement",
        icon: "settings_suggest",
      },
      {
        key: "Quotation",
        name: "Quotation",
        link: "/app/quotation",
        icon: "settings_suggest",
      },
      {
        key: "Billing",
        name: "Billing",
        link: "/app/billing",
        icon: "settings_suggest",
      },

    ],
  },
  {
    key: "Asset",
    name: "Asset",
    icon: "settings_suggest",
    child: [
      {
        key: "Contractor",
        name: "Contractor",
        link: "/app/Contractor",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Products",
        name: "Products",
        title: true,
      },
      {
        key: "Category",
        name: "Category",
        link: "/app/Category",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Suppiler",
        name: "Supplier",
        link: "/app/Supplier",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Products",
        name: "Products",
        link: "/app/Product",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Warehouses",
        name: "warehouses",
        title: true,
      },
      {
        key: "Warehouse",
        name: "Warehouse",
        link: "/app/Warehouse",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Invetory & Stocks",
        name: "Invetory & Stocks",
        title: true,
      },
      {
        key: "Warehouse Stocks",
        name: "Warehouse stocks",
        link: "/app/Warehouse_list",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Contractor / Engineer Stocks",
        name: "Contractor / Engineer Stocks",
        link: "/app/Con_Eng_list",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Purchase Indent",
        name: "Purchase Indent",
        link: "/app/PurchaseIndent",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Stock Transfer",
        name: "Stock Transfer",
        link: "/app/Job_Application",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Transfer Indent",
        name: "Transfer Indent",
        link: "/app/Job_Application",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Stock Receive",
        name: "Stock Receive",
        link: "/app/Job_Application",
        icon: "settings_suggest",
        badge: "Hot",
      },
      {
        key: "Stock Recall",
        name: "Stock Recall",
        link: "/app/Job_Application",
        icon: "settings_suggest",
        badge: "Hot",
      },

    ],
  }
];
