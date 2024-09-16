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
  LogNotes,
  Channel,
} from "../pageListAsync";

function Application(props) {
  const { history } = props;
  const changeMode = useContext(ThemeContext);

  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<AnalyticDashboard />} />
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
        {/* Lead Pages */}

        <Route path="lead/lead-status" element={<LeadStatus />} />
        <Route path="lead/log-notes" element={<LogNotes />} />
        <Route path="lead/Channel" element={<Channel />} />
      </Routes>
    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
