import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import BaseLayout from 'layouts/BaseLayout';

const Plan = React.lazy(() => import('pages/plan'));
const Student = React.lazy(() => import('pages/student'));
const Users = React.lazy(() => import('pages/Users'));
const AllPaymentDues = React.lazy(() => import('pages/all-payment-dues'));
const Login = React.lazy(() => import('pages/login'));
const Profile = React.lazy(() => import('pages/Profile'));

const [html] = document.getElementsByTagName('html')

function App() {
  const { isDark } = useSelector(state => state.theme)

  React.useEffect(() => {
    if (isDark) {
      html.setAttribute('dark', 'true')
    } else {
      html.removeAttribute('dark')
    }
  }, [isDark])

  return (
    <>
      <BrowserRouter>
          <Switch>
          <BaseLayout>
            <Suspense fallback={<p></p>}>
              <PrivateRoute path="/plan" component={Plan} />
              <PrivateRoute path="/student" component={Student} />
              <PrivateRoute path="/all-payment-dues" component={AllPaymentDues} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/profile" component={Profile} />
            </Suspense>
            </BaseLayout>
            <Route path="/login" component={Login} />
            <Redirect from="/" to="/student" />
          </Switch>
      </BrowserRouter>
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
