import React from "react";
import ConfirmationPage from "./pages/ConfirmationPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import EmquiryPage from "./pages/EmquiryPage";
import Outbound from "./pages/Outbound";
import UsdFormPage from "./pages/UsdFormPage";
import MmkFormPage from "./pages/MmkFormPage";
import TestPage from "./pages/TestPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Outbound />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/usd",
        element: <UsdFormPage />,
      },
      {
        path: "/mmk",
        element: <MmkFormPage />,
      },
      {
        path: "/confirm",
        element: <ConfirmationPage />,
      },
      {
        path: "/emquiry",
        element: <EmquiryPage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
