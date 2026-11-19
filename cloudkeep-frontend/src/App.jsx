
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Myfiles from './pages/Myfiles'
import PublicFileView from './pages/PublicFileView'
import Subscription from './pages/Subscription'
import Transactions from './pages/Transactions'
import Upload from './pages/Upload'
import { RedirectToSignIn, Show } from '@clerk/react'
import {Toaster} from 'react-hot-toast'
import {UserCreditsProvider} from './context/UserCreditsContext'

const App = () => {
  return (
    <UserCreditsProvider>
          <BrowserRouter>
          <Toaster/>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={
                <>
                  <Show when="signed-in"><Dashboard/></Show>
                  <Show when="signed-out"><RedirectToSignIn/></Show>
                </>
              } />
              <Route path="/myfiles" element={
                <>
                  <Show when="signed-in"><Myfiles/></Show>
                  <Show when="signed-out"><RedirectToSignIn/></Show>
                </>
              } />
              <Route path="/publicfileview" element={<PublicFileView />} />
              <Route path="/subscription" element={
                <>
                  <Show when="signed-in"><Subscription/></Show>
                  <Show when="signed-out"><RedirectToSignIn/></Show>
                </>
              } />
              <Route path="/transactions" element={
                <>
                  <Show when="signed-in"><Transactions/></Show>
                  <Show when="signed-out"><RedirectToSignIn/></Show>
                </>
              } />
              <Route path="/upload" element={
                <>
                  <Show when="signed-in"><Upload/></Show>
                  <Show when="signed-out"><RedirectToSignIn/></Show>
                </>
              } />
              <Route path='/file/:fileId' element={
                <>
                  <PublicFileView/>
                </>
              }/>
              <Route path="/*" element={<RedirectToSignIn />} />
            </Routes>
          </BrowserRouter>
    </UserCreditsProvider>
  )
}

export default App