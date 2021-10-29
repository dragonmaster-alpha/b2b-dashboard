import React, {Suspense} from "react";
import {BreakpointProvider} from 'react-socks';

import '../../i18n';
import Navbar from "./Navbar.js";
import Venueview from "./Venueview.js";

function Home() {  
  return (
    <>
    <BreakpointProvider>
        <Suspense fallback={null}>
            <Navbar depth="no"/>
            <Venueview/>
        </Suspense>
    </BreakpointProvider>
    </>
  );
}

export default Home;
