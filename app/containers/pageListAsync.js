import React from "react";
import Loading from "enl-components/Loading";
import loadable from "../utils/loadable";

// Landing Page
export const HomePage = loadable(() => import("./LandingPage/HomePage"), {
  fallback: <Loading />,
});
// Dashboard
export const AnalyticDashboard = loadable(
  () => import("./Dashboard/AnalyticDashboard"),
  {
    fallback: <Loading />,
  }
);
export const MarketingDashboard = loadable(
  () => import("./Dashboard/MarketingDashboard"),
  {
    fallback: <Loading />,
  }
);
export const CryptoDashboard = loadable(
  () => import("./Dashboard/CryptoDashboard"),
  {
    fallback: <Loading />,
  }
);

// Layouts
export const Infographics = loadable(() => import("./Widgets/Infographics"), {
  fallback: <Loading />,
});
export const MiniApps = loadable(() => import("./Widgets/MiniApps"), {
  fallback: <Loading />,
});
export const Analytics = loadable(() => import("./Widgets/Analytics"), {
  fallback: <Loading />,
});
export const Gallery = loadable(() => import("./Widgets/Gallery"), {
  fallback: <Loading />,
});
export const Status = loadable(() => import("./Widgets/Status"), {
  fallback: <Loading />,
});

// Layouts
export const AppLayout = loadable(() => import("./Layouts/AppLayout"), {
  fallback: <Loading />,
});
export const Responsive = loadable(() => import("./Layouts/Responsive"), {
  fallback: <Loading />,
});
export const Grid = loadable(() => import("./Layouts/Grid"), {
  fallback: <Loading />,
});

// Tables
export const SimpleTable = loadable(() => import("./Tables/BasicTable"), {
  fallback: <Loading />,
});
export const AdvancedTable = loadable(() => import("./Tables/AdvancedTable"), {
  fallback: <Loading />,
});
export const EditableCell = loadable(() => import("./Tables/EditableCell"), {
  fallback: <Loading />,
});
export const TreeTable = loadable(() => import("./Tables/TreeTable"), {
  fallback: <Loading />,
});
export const TablePlayground = loadable(
  () => import("./Tables/TablePlayground"),
  {
    fallback: <Loading />,
  }
);

// Forms
export const FormikForm = loadable(() => import("./Forms/FormikForm"), {
  fallback: <Loading />,
});
export const DateTimePicker = loadable(() => import("./Forms/DateTimePicker"), {
  fallback: <Loading />,
});
export const CheckboxRadio = loadable(() => import("./Forms/CheckboxRadio"), {
  fallback: <Loading />,
});
export const Switches = loadable(() => import("./Forms/Switches"), {
  fallback: <Loading />,
});
export const Selectbox = loadable(() => import("./Forms/Selectbox"), {
  fallback: <Loading />,
});
export const SliderRange = loadable(() => import("./Forms/SliderRange"), {
  fallback: <Loading />,
});
export const Buttons = loadable(() => import("./Forms/Buttons"), {
  fallback: <Loading />,
});
export const ToggleButton = loadable(() => import("./Forms/ToggleButton"), {
  fallback: <Loading />,
});
export const Textbox = loadable(() => import("./Forms/Textbox"), {
  fallback: <Loading />,
});
export const Autocomplete = loadable(() => import("./Forms/Autocomplete"), {
  fallback: <Loading />,
});
export const TextEditor = loadable(() => import("./Forms/TextEditor"), {
  fallback: <Loading />,
});
export const Upload = loadable(() => import("./Forms/Upload"), {
  fallback: <Loading />,
});
export const DialButton = loadable(() => import("./Forms/DialButton"), {
  fallback: <Loading />,
});

// UI Components
export const Badges = loadable(() => import("./UiElements/Badges"), {
  fallback: <Loading />,
});
export const Avatars = loadable(() => import("./UiElements/Avatars"), {
  fallback: <Loading />,
});
export const Accordion = loadable(() => import("./UiElements/Accordion"), {
  fallback: <Loading />,
});
export const List = loadable(() => import("./UiElements/List"), {
  fallback: <Loading />,
});
export const PopoverTooltip = loadable(
  () => import("./UiElements/PopoverTooltip"),
  {
    fallback: <Loading />,
  }
);
export const Snackbar = loadable(() => import("./UiElements/Snackbar"), {
  fallback: <Loading />,
});
export const Typography = loadable(() => import("./UiElements/Typography"), {
  fallback: <Loading />,
});
export const Tabs = loadable(() => import("./UiElements/Tabs"), {
  fallback: <Loading />,
});
export const Cards = loadable(() => import("./UiElements/Cards"), {
  fallback: <Loading />,
});
export const ImageGrid = loadable(() => import("./UiElements/ImageGrid"), {
  fallback: <Loading />,
});
export const Progress = loadable(() => import("./UiElements/Progress"), {
  fallback: <Loading />,
});
export const DialogModal = loadable(() => import("./UiElements/DialogModal"), {
  fallback: <Loading />,
});
export const Steppers = loadable(() => import("./UiElements/Steppers"), {
  fallback: <Loading />,
});
export const DrawerMenu = loadable(() => import("./UiElements/DrawerMenu"), {
  fallback: <Loading />,
});
export const Breadcrumbs = loadable(() => import("./UiElements/Breadcrumbs"), {
  fallback: <Loading />,
});
export const Icons = loadable(() => import("./UiElements/Icons"), {
  fallback: <Loading />,
});
export const SliderCarousel = loadable(
  () => import("./UiElements/SliderCarousel"),
  {
    fallback: <Loading />,
  }
);
export const Tags = loadable(() => import("./UiElements/Tags"), {
  fallback: <Loading />,
});
export const TreeView = loadable(() => import("./UiElements/TreeView"), {
  fallback: <Loading />,
});
// Chart
export const LineCharts = loadable(() => import("./Charts/LineCharts"), {
  fallback: <Loading />,
});
export const BarCharts = loadable(() => import("./Charts/BarCharts"), {
  fallback: <Loading />,
});
export const AreaCharts = loadable(() => import("./Charts/AreaCharts"), {
  fallback: <Loading />,
});
export const PieCharts = loadable(() => import("./Charts/PieCharts"), {
  fallback: <Loading />,
});
export const RadarCharts = loadable(() => import("./Charts/RadarCharts"), {
  fallback: <Loading />,
});
export const ScatterCharts = loadable(() => import("./Charts/ScatterCharts"), {
  fallback: <Loading />,
});
export const CompossedCharts = loadable(
  () => import("./Charts/CompossedCharts"),
  {
    fallback: <Loading />,
  }
);

// Pages
export const LoginFullstack = loadable(
  () => import("./Pages/UsersFirebase/Login"),
  {
    fallback: <Loading />,
  }
);
export const RegisterFullstack = loadable(
  () => import("./Pages/UsersFirebase/Register"),
  {
    fallback: <Loading />,
  }
);
export const ResetPasswordFullstack = loadable(
  () => import("./Pages/UsersFirebase/ResetPassword"),
  {
    fallback: <Loading />,
  }
);
export const Login = loadable(() => import("./Pages/Users/Login"), {
  fallback: <Loading />,
});
export const Register = loadable(() => import("./Pages/Users/Register"), {
  fallback: <Loading />,
});
export const ResetPassword = loadable(
  () => import("./Pages/Users/ResetPassword"),
  {
    fallback: <Loading />,
  }
);

export const LockScreen = loadable(() => import("./Pages/Users/LockScreen"), {
  fallback: <Loading />,
});
export const ComingSoon = loadable(() => import("./Pages/ComingSoon"), {
  fallback: <Loading />,
});
export const Ecommerce = loadable(() => import("./Pages/Ecommerce"), {
  fallback: <Loading />,
});
export const ProductPage = loadable(
  () => import("./Pages/Ecommerce/ProductPage"),
  {
    fallback: <Loading />,
  }
);
export const CheckoutPage = loadable(
  () => import("./Pages/Ecommerce/CheckoutPage"),
  {
    fallback: <Loading />,
  }
);
export const InvoicePage = loadable(
  () => import("./Pages/Ecommerce/InvoicePage"),
  {
    fallback: <Loading />,
  }
);
export const Profile = loadable(() => import("./Pages/UserProfile"), {
  fallback: <Loading />,
});
export const Timeline = loadable(() => import("./Pages/Timeline"), {
  fallback: <Loading />,
});
export const Chat = loadable(() => import("./Pages/Chat"), {
  fallback: <Loading />,
});
export const BlankPage = loadable(() => import("./Pages/BlankPage"), {
  fallback: <Loading />,
});
export const AuthenticatedPage = loadable(
  () => import("./Pages/AuthenticatedPage"),
  {
    fallback: <Loading />,
  }
);

// Sample Pre Build Apps
export const Todo = loadable(() => import("./SampleApps/Todo"), {
  fallback: <Loading />,
});
export const TodoFirebase = loadable(
  () => import("./SampleFirebaseApps/Todo"),
  {
    fallback: <Loading />,
  }
);
export const Contact = loadable(() => import("./SampleApps/Contact"), {
  fallback: <Loading />,
});
export const ContactFirebase = loadable(
  () => import("./SampleFirebaseApps/Contact"),
  {
    fallback: <Loading />,
  }
);
export const Email = loadable(() => import("./SampleApps/Email"), {
  fallback: <Loading />,
});
export const EmailFirebase = loadable(
  () => import("./SampleFirebaseApps/Email"),
  {
    fallback: <Loading />,
  }
);

export const Photos = loadable(() => import("./Pages/Photos"), {
  fallback: <Loading />,
});

// Maps
export const MapMarker = loadable(() => import("./Maps/MapMarker"), {
  fallback: <Loading />,
});
export const MapDirection = loadable(() => import("./Maps/MapDirection"), {
  fallback: <Loading />,
});
export const SearchMap = loadable(() => import("./Maps/SearchMap"), {
  fallback: <Loading />,
});
export const TrafficIndicator = loadable(
  () => import("./Maps/TrafficIndicator"),
  {
    fallback: <Loading />,
  }
);
export const StreetViewMap = loadable(() => import("./Maps/StreetViewMap"), {
  fallback: <Loading />,
});

// Other
export const NotFound = loadable(() => import("./NotFound/NotFound"), {
  fallback: <Loading />,
});
export const NotFoundDedicated = loadable(
  () => import("./Pages/Standalone/NotFoundDedicated"),
  {
    fallback: <Loading />,
  }
);
export const Error = loadable(() => import("./Pages/Error"), {
  fallback: <Loading />,
});
export const Maintenance = loadable(() => import("./Pages/Maintenance"), {
  fallback: <Loading />,
});
export const Parent = loadable(() => import("./Parent"), {
  fallback: <Loading />,
});
export const TermsConditions = loadable(
  () => import("./Pages/TermsConditions"),
  {
    fallback: <Loading />,
  }
);
// pagess
export const LeadStatus = loadable(
  () => import("../api/Lead_Management/Lead_Status"),
  {
    fallback: <Loading />,
  }
);
export const LogNotes = loadable(
  () => import("../api/Lead_Management/Log_Notes"),
  {
    fallback: <Loading />,
  }
);

export const Channel = loadable(
  () => import("../api/Lead_Management/Channel"),
  {
    fallback: <Loading />,
  }
);

// ---------------------------------------------------------------
//            TRUPTI DEV CODE
// ---------------------------------------------------------------
export const Custom_Question = loadable(
  () => import("../containers/Pages/Recruitment/Custom_Question"),
  {
    fallback: <Loading />,
  }
);
export const Interviewer = loadable(
  () => import("../containers/Pages/Recruitment/Interviewer"),
  {
    fallback: <Loading />,
  }
);
export const Applicantlist = loadable(
  () => import("../containers/Pages/Recruitment/applicantlist"),
  {
    fallback: <Loading />,
  }
);

export const Job_Application = loadable(
  () => import("../containers/Pages/Recruitment/Job_Application"),
  {
    fallback: <Loading />,
  }
);
export const JobAppView = loadable(
  () => import("../containers/Pages/Recruitment/jobview"),
  {
    fallback: <Loading />,
  }
);
export const JobApplicantView = loadable(
  () => import("../containers/Pages/Recruitment/applicantview"),
  {
    fallback: <Loading />,
  }
);
export const Requirement = loadable(
  () => import("../containers/Pages/Procurement/requirement"),
  {
    fallback: <Loading />,
  }
);
export const Quotation = loadable(
  () => import("../containers/Pages/Procurement/quotation"),
  {
    fallback: <Loading />,
  }
);
export const Billing = loadable(
  () => import("../containers/Pages/Procurement/billing"),
  {
    fallback: <Loading />,
  }
);


// ---------------------------------------------------------------
export const Campaign = loadable(
  () => import("../api/Lead_Management/Campaign"),
  {
    fallback: <Loading />,
  }
);
export const NewLead = loadable(
  () => import("../api/Lead_Management/New_lead"),
  {
    fallback: <Loading />,
  }
);
export const LeadMembers = loadable(
  () => import("../api/Lead_Management/LeadMemebers"),
  {
    fallback: <Loading />,
  }
);

export const LeadDetails = loadable(
  () => import("../api/Lead_Management/LeadDetails"),
  {
    fallback: <Loading />,
  }
);
export const Invoice = loadable(
  () => import("../containers/Pages/Sales/Invoice"),
  {
    fallback: <Loading />,
  }
);
export const BillTax = loadable(
  () => import("../containers/Pages/Sales/BillTax"),
  {
    fallback: <Loading />,
  }
);
export const Proposal = loadable(
  () => import("../containers/Pages/Sales/Proposal"),
  {
    fallback: <Loading />,
  }
);
export const ProposalView = loadable(
  () => import("../containers/Pages/Sales/ProposalView"),
  {
    fallback: <Loading />,
  }
);
export const Customer = loadable(
  () => import("../containers/Pages/Sales/Customer"),
  {
    fallback: <Loading />,
  }
);
export const CustomerView = loadable(
  () => import("../containers/Pages/Sales/CustomerView"),
  {
    fallback: <Loading />,
  }
);
export const InvoiceUpdate = loadable(
  () => import("../containers/Pages/Sales/InvoiceUpdate"),
  {
    fallback: <Loading />,
  }
);
export const InvoiceView = loadable(
  () => import("../containers/Pages/Sales/InvoiceView"),
  {
    fallback: <Loading />,
  }
);
export const Payments = loadable(
  () => import("../containers/Pages/Sales/Payments"),
  {
    fallback: <Loading />,
  }
);
export const Project = loadable(
  () => import("../containers/Pages/Sales/Project"),
  {
    fallback: <Loading />,
  }
);
export const ProjectMetaData = loadable(
  () => import("../containers/Pages/Sales/ProjectMetaData"),
  {
    fallback: <Loading />,
  }
);
export const FBLogin = loadable(
  () => import("../containers/Pages/Sales/FBLogin"),
  {
    fallback: <Loading />,
  }
);
// ------------------------------------------------
// Asset management
// ------------------------------------------------
export const Contractor = loadable(
  () => import("../containers/Pages/AssetModule/Contractor"),
  {
    fallback: <Loading />,
  }
);

export const Category = loadable(
  () => import("../containers/Pages/AssetModule/Category"),
  {
    fallback: <Loading />,
  }
);

export const Supplier = loadable(
  () => import("../containers/Pages/AssetModule/Supplier"),
  {
    fallback: <Loading />,
  }
);

export const Product = loadable(
  () => import("../containers/Pages/AssetModule/Product"),
  {
    fallback: <Loading />,
  }
);

export const Warehouse = loadable(
  () => import("../containers/Pages/AssetModule/Warehouse"),
  {
    fallback: <Loading />,
  }
);
export const Warehouse_list = loadable(
  () => import("../containers/Pages/AssetModule/Warehouses/Warehouse_list"),
  {
    fallback: <Loading />,
  }
);
export const WarehouseStock = loadable(
  () => import("../containers/Pages/AssetModule/Warehouses/WarehouseStock"),
  {
    fallback: <Loading />,
  }
);
export const Con_Eng_list = loadable(
  () => import("../containers/Pages/AssetModule/Con_Eng_stocks/Con_Eng_list"),
  {
    fallback: <Loading />,
  }
);
export const Con_Eng_Stock = loadable(
  () => import("../containers/Pages/AssetModule/Con_Eng_stocks/Con_Eng_Stock"),
  {
    fallback: <Loading />,
  }
);
export const PurchaseIndent = loadable(
  () => import("../containers/Pages/AssetModule/PurchaseIndent"),
  {
    fallback: <Loading />,
  }
);
