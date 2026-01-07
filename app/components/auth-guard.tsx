"use client";

import React from "react";
import withAuth from "../authHOC";

const AuthGuardContent = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default withAuth(AuthGuardContent);
