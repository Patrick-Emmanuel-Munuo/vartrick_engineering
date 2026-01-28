/* require modules */
import { Routes, Route } from 'react-router-dom'
import routers from './routes'

/* routing function */
function routing(application) {
    return (
        <Routes>
            {
                routers.map((route, index) => {
                    if (!application.state.authenticated && route.guest){
                        return (
                           <Route
                                key = {index}
                                path = {route.path}
                                element = {<route.component application = {application}/>}
                                rander = {(props) => (
                                    < route.component {...props} application={application} />
                                )}
                                exact
                            />
                        )
                    }else if (application.state.authenticated && !route.guest){
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element = {<route.component application = {application}/>}
                                render={(props) => (
                                    < route.component {...props} application={application} />
                                )}
                                exact
                            />
                        )
                    }else{
                        return null
                    }
                })
            }
        </Routes>
    )
}

/* export routing function for global accessibility */
export default routing