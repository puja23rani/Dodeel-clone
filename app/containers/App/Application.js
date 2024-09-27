import React, { useContext } from "react";
import { PropTypes } from "prop-types";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Templates/Dashboard";
import { ThemeContext } from "./ThemeWrapper";
import ProtectedPage from "../Session/ProtectedPage";
import {
  AnalyticDashboard,
  MarketingDashboard,
  CryptoDashboard,
  Infographics,
  MiniApps,
  Analytics,
  Gallery,
  Status,
  Parent,
  AppLayout,
  Responsive,
  Grid,
  SimpleTable,
  AdvancedTable,
  TablePlayground,
  TreeTable,
  EditableCell,
  FormikForm,
  DialButton,
  DateTimePicker,
  CheckboxRadio,
  Switches,
  Selectbox,
  SliderRange,
  Buttons,
  ToggleButton,
  Textbox,
  Autocomplete,
  Upload,
  TextEditor,
  Avatars,
  Accordion,
  Badges,
  List,
  PopoverTooltip,
  Snackbar,
  Typography,
  Tabs,
  Cards,
  ImageGrid,
  Progress,
  DialogModal,
  Steppers,
  DrawerMenu,
  Breadcrumbs,
  Icons,
  SliderCarousel,
  Tags,
  TreeView,
  LineCharts,
  BarCharts,
  AreaCharts,
  PieCharts,
  RadarCharts,
  ScatterCharts,
  CompossedCharts,
  Todo,
  Contact,
  Email,
  TodoFirebase,
  EmailFirebase,
  ContactFirebase,
  Chat,
  Timeline,
  Profile,
  Ecommerce,
  ProductPage,
  CheckoutPage,
  InvoicePage,
  BlankPage,
  AuthenticatedPage,
  Photos,
  Error,
  MapMarker,
  MapDirection,
  SearchMap,
  TrafficIndicator,
  StreetViewMap,
  NotFound,
  LeadStatus,
  Custom_Question,
  LogNotes,
  Channel,
  Interviewer,
  Job_Application,
  Campaign,
  NewLead,
  LeadMembers,
  LeadDetails,
  Applicantlist,
  BillTax,
  Proposal_Template,
  Invoice,
  Payments,
  Project,
  Proposal,
  Customer,
  InvoiceView,
  CustomerView,
  InvoiceUpdate,
  ProjectMetaData,

} from "../pageListAsync";
import Department from "../Pages/HRMmodule/HRMsettings/Department";
import Designation from "../Pages/HRMmodule/HRMsettings/Designation";
import Leave from "../Pages/HRMmodule/HRMsettings/Leave";
import Allowance from "../Pages/HRMmodule/HRMsettings/Allowance";
import Performance from "../Pages/HRMmodule/HRMsettings/Performance";
import CompentencyType from "../Pages/HRMmodule/HRMsettings/CompentencyType";
import Competenies from "../Pages/HRMmodule/HRMsettings/Competenies";
import OfficeShift from "../Pages/HRMmodule/HRMsettings/OfficeShift";
import ContactDetails from "../Pages/HRMmodule/HRMsettings/ContactDetails";
import Contractor from "../Pages/AssetModule/Contractor";
import Category from "../Pages/AssetModule/Category";
import Supplier from "../Pages/AssetModule/Supplier";
import JobAppView from "../Pages/Recruitment/JobAppView";

import EmployeeDetails from "../Pages/HRMmodule/HRMmanagement/EmployeeDetails";
import CreateEmployee from "../Pages/HRMmodule/HRMmanagement/CreateEmployee";
import TimeSheet from "../Pages/HRMmodule/HRMmanagement/TimeSheet";
import Attendance from "../Pages/HRMmodule/HRMmanagement/Attendance";
import LeaveRequest from "../Pages/HRMmodule/HRMmanagement/LeaveRequest";
import Task from "../Pages/HRMmodule/HRMmanagement/Task";
import Holidays from "../Pages/HRMmodule/HRMmanagement/Holidays";
import Payroll from "../Pages/HRMmodule/HRMmanagement/Payroll";
import AppraisalList from "../Pages/HRMmodule/HRMmanagement/AppraisalList";
import JobApplicantView from "../Pages/Recruitment/applicantview";
import Requirement from "../Pages/Procurement/requirement";
import Quotation from "../Pages/Procurement/quotation";
import Billing from "../Pages/Procurement/billing";
import PayrollDetails from "../Pages/HRMmodule/HRMmanagement/PayrollDetails";
import Product from "../Pages/AssetModule/Product";
import Warehouse from "../Pages/AssetModule/Warehouse";
import Warehouse_list from "../Pages/AssetModule/Warehouses/Warehouse_list";
import WarehouseStock from "../Pages/AssetModule/Warehouses/WarehouseStock";
import Con_Eng_list from "../Pages/AssetModule/Con_Eng_stocks/Con_Eng_list";
import Con_Eng_Stock from "../Pages/AssetModule/Con_Eng_stocks/Con_Eng_Stock";
import PurchaseIndent from "../Pages/AssetModule/PurchaseIndent";

function Application(props) {
  const { history } = props;
  const changeMode = useContext(ThemeContext);

  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<AnalyticDashboard />} />
        <Route path="/app" element={<AnalyticDashboard />} />
        <Route path="dashboard/marketing" element={<MarketingDashboard />} />
        <Route path="dashboard/crypto" element={<CryptoDashboard />} />

        {/* Widgets */}
        <Route path="widgets" element={<Parent />} />
        <Route path="widgets/infographics" element={<Infographics />} />
        <Route path="widgets/mini-apps" element={<MiniApps />} />
        <Route path="widgets/analytics" element={<Analytics />} />
        <Route path="widgets/gallery-carousel" element={<Gallery />} />
        <Route path="widgets/status" element={<Status />} />
        {/* Layout */}
        <Route path="layouts" element={<Parent />} />
        <Route path="layouts/grid" element={<Grid />} />
        <Route path="layouts/app-layout" element={<AppLayout />} />
        <Route path="layouts/responsive" element={<Responsive />} />
        {/* Table */}
        <Route path="tables" element={<Parent />} />
        <Route path="tables/basic-table" element={<SimpleTable />} />
        <Route path="tables/data-table" element={<AdvancedTable />} />
        <Route path="tables/table-playground" element={<TablePlayground />} />
        <Route path="tables/editable-cell" element={<EditableCell />} />
        <Route path="tables/tree-table" element={<TreeTable />} />
        {/* Form & Button */}
        <Route path="forms" element={<Parent />} />
        <Route path="forms/formikform" element={<FormikForm />} />
        <Route path="forms/date-time-picker" element={<DateTimePicker />} />
        <Route path="forms/dial-button" element={<DialButton />} />
        <Route path="forms/checkbox-radio" element={<CheckboxRadio />} />
        <Route path="forms/switches" element={<Switches />} />
        <Route path="forms/selectbox" element={<Selectbox />} />
        <Route path="forms/slider-range" element={<SliderRange />} />
        <Route path="forms/buttons" element={<Buttons />} />
        <Route path="forms/toggle-button" element={<ToggleButton />} />
        <Route path="forms/textfields" element={<Textbox />} />
        <Route path="forms/autocomplete" element={<Autocomplete />} />
        <Route path="forms/upload" element={<Upload />} />
        <Route path="forms/wysiwyg-editor" element={<TextEditor />} />
        {/* Ui Components */}
        <Route path="ui" element={<Parent />} />
        <Route path="ui/avatars" element={<Avatars />} />
        <Route path="ui/accordion" element={<Accordion />} />
        <Route path="ui/badges" element={<Badges />} />
        <Route path="ui/list" element={<List />} />
        <Route path="ui/popover-tooltip" element={<PopoverTooltip />} />
        <Route path="ui/snackbar" element={<Snackbar />} />
        <Route path="ui/typography" element={<Typography />} />
        <Route path="ui/tabs" element={<Tabs />} />
        <Route path="ui/card-papper" element={<Cards />} />
        <Route path="ui/image-grid" element={<ImageGrid />} />
        <Route path="ui/progress" element={<Progress />} />
        <Route path="ui/dialog-modal" element={<DialogModal />} />
        <Route path="ui/steppers" element={<Steppers />} />
        <Route path="ui/drawer-menu" element={<DrawerMenu />} />
        <Route path="ui/breadcrumbs" element={<Breadcrumbs />} />
        <Route path="ui/icons" element={<Icons />} />
        <Route path="ui/slider-carousel" element={<SliderCarousel />} />
        <Route path="ui/tags" element={<Tags />} />
        <Route path="ui/tree-view" element={<TreeView />} />
        {/* Chart */}
        <Route path="charts" element={<Parent />} />
        <Route path="charts/line-charts" element={<LineCharts />} />
        <Route path="charts/bar-charts" element={<BarCharts />} />
        <Route path="charts/area-charts" element={<AreaCharts />} />
        <Route path="charts/pie-charts" element={<PieCharts />} />
        <Route path="charts/radar-charts" element={<RadarCharts />} />
        <Route path="charts/scatter-charts" element={<ScatterCharts />} />
        <Route path="charts/compossed-chart" element={<CompossedCharts />} />
        {/* Sample Apps */}
        <Route path="pages/contact" element={<Contact />} />
        <Route path="pages/email" element={<Email />} />
        <Route path="pages/todo" element={<Todo />} />
        <Route path="pages/todo-firebase" element={<TodoFirebase />} />
        <Route path="pages/email-firebase" element={<EmailFirebase />} />
        <Route path="pages/contact-firebase" element={<ContactFirebase />} />
        {/* Pages */}
        <Route path="pages" element={<Parent />} />
        <Route path="pages/user-profile" element={<Profile />} />
        <Route path="pages/timeline" element={<Timeline />} />
        <Route path="pages/chat" element={<Chat />} />
        <Route path="pages/ecommerce" element={<Ecommerce />} />
        <Route path="pages/product-detail" element={<ProductPage />} />
        <Route path="pages/checkout" element={<CheckoutPage />} />
        <Route path="pages/invoice" element={<InvoicePage />} />
        <Route
          path="pages/authenticated-page"
          element={
            <ProtectedPage>
              <AuthenticatedPage />
            </ProtectedPage>
          }
        />
        <Route path="pages/blank-page" element={<BlankPage />} />
        <Route path="pages/photo-gallery" element={<Photos />} />
        <Route path="pages/not-found" element={<NotFound />} />
        <Route path="pages/error" element={<Error />} />
        {/* Map */}
        <Route path="maps" element={<Parent />} />
        <Route path="maps/map-marker" element={<MapMarker />} />
        <Route path="maps/map-direction" element={<MapDirection />} />
        <Route path="maps/map-searchbox" element={<SearchMap />} />
        <Route path="maps/map-traffic" element={<TrafficIndicator />} />
        <Route path="maps/street-view" element={<StreetViewMap />} />
        {/* Default */}
        <Route path="*" element={<NotFound />} />


        {/* ---------------HRM Modules--------------- */}
        {/* HRM Setting */}
        <Route path="hrm-setting/department" element={<Department />} />
        <Route path="hrm-setting/designation" element={<Designation />} />
        <Route path="hrm-setting/leave" element={<Leave />} />
        <Route path="hrm-setting/allowance" element={<Allowance />} />
        <Route path="hrm-setting/performance" element={<Performance />} />
        <Route path="hrm-setting/compentency-type" element={<CompentencyType />} />
        <Route path="hrm-setting/competenies" element={<Competenies />} />
        <Route path="hrm-setting/office-shift" element={<OfficeShift />} />
        <Route path="hrm-setting/contact-details" element={<ContactDetails />} />

        {/* HRM Management */}
        <Route path="hrm-setting/employee-details" element={<EmployeeDetails />} />
        <Route path="hrm-setting/employee-details/create-employee-details" element={<CreateEmployee />} />
        <Route path="hrm-setting/timeSheet" element={<TimeSheet />} />
        <Route path="hrm-setting/attendance" element={<Attendance />} />
        <Route path="hrm-setting/leave-request" element={<LeaveRequest />} />
        <Route path="hrm-setting/task" element={<Task />} />
        <Route path="hrm-setting/holidays" element={<Holidays />} />
        <Route path="hrm-setting/payroll" element={<Payroll />} />
        <Route path="hrm-setting/payroll-details" element={<PayrollDetails />} />
        <Route path="hrm-setting/appraisal-list" element={<AppraisalList />} />
        {/* ------------------------------------------ */}

        {/* Lead Pages */}
        <Route path="lead/lead-status" element={<LeadStatus />} />
        <Route path="/Custom_Question" element={<Custom_Question />} />
        <Route path="lead/log-notes" element={<LogNotes />} />
        <Route path="lead/channel" element={<Channel />} />
        <Route path="lead/campaign" element={<Campaign />} />
        <Route path="lead/new-lead" element={<NewLead />} />
        <Route path="lead/lead-members" element={<LeadMembers />} />
        <Route path="lead/new-lead/lead-details" element={<LeadDetails />} />

        {/* Recruitment Pages */}
        <Route path="/Custom_Question" element={<Custom_Question />} />
        <Route path="/Interviewer" element={<Interviewer />} />
        <Route path="/applicantlist" element={<Applicantlist />} />
        <Route path="/Job_Application" element={<Job_Application />} />
        {/* --------- */}
        <Route path="/jobview" element={<JobAppView />} />
        <Route path="/applicantview" element={<JobApplicantView />} />



        {/* Procurement Pages */}
        <Route path="/requirement" element={<Requirement />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/billing" element={<Billing />} />


        {/* Sales Pages */}
        <Route path="/sales/bill-tax" element={<BillTax />} />
        <Route path="/sales/customer" element={<Customer />} />
        <Route path="/sales/customer/customer-view" element={<CustomerView />} />

        <Route path="/sales/invoice" element={<Invoice />} />
        <Route path="/sales/invoice/invoice-update" element={<InvoiceUpdate />} />
        <Route path="/sales/invoice/invoice-view" element={<InvoiceView />} />
        <Route path="/sales/payments" element={<Payments />} />
        <Route path="/sales/project" element={<Project />} />
        <Route path="/sales/project/project-metadata" element={<ProjectMetaData />} />
        <Route path="/sales/proposal" element={<Proposal />} />


        {/* Asset Management Pages */}
        <Route path="/Contractor" element={<Contractor />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Supplier" element={<Supplier />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Warehouse" element={<Warehouse />} />
        <Route path="/Warehouse_list" element={<Warehouse_list />} />
        <Route path="/WarehouseStock" element={<WarehouseStock />} />
        <Route path="/Con_Eng_list" element={<Con_Eng_list />} />
        <Route path="/Contractor-Engineer-Stock" element={<Con_Eng_Stock />} />
        <Route path="/PurchaseIndent" element={<PurchaseIndent />} />

    

        <Route path="/jobview" element={<JobAppView />} />
        <Route path="/applicantview" element={<JobApplicantView />} />
      </Routes>



    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
