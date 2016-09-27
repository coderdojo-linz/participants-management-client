import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { ParticipantsComponent } from "./participants/participants.component";
import { ScanComponent } from "./scan/scan.component";
import { SetPinComponent } from "./set-pin/set-pin.component";
import { ImportComponent } from "./import/import.component";

const appRoutes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "participants", component: ParticipantsComponent },
	{ path: "scan", component: ScanComponent },
	{ path: "set-pin", component: SetPinComponent },
	{ path: "import", component: ImportComponent },
	// TODO: use other default page
	{ path: "", redirectTo: "/scan", pathMatch: "full" }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
