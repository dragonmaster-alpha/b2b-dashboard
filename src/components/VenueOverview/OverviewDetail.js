import React, {Suspense} from "react";
import {BreakpointProvider} from 'react-socks';

import '../../i18n';
import Navbar from "./Navbar.js";
import VenueviewDetail from "./VenueviewDetail.js";

function Home() {  
  return (
    <>
    <BreakpointProvider>
        <Suspense fallback={null}>
            <Navbar depth="detail"/>
            <VenueviewDetail/>
        </Suspense>
    </BreakpointProvider>
    </>
  );
}

export default Home;
