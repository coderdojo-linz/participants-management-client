import {Router, RouteConfig, RouterOutlet, RouterLink, ROUTER_DIRECTIVES, ComponentInstruction} from "angular2/router";
import {AuthenticationService} from "./../authentication/authentication.service.ts";
import {DynamicComponentLoader, ElementRef, OnDestroy, Directive, Attribute, ViewContainerRef} from "angular2/core";

@Directive({
	selector: "router-outlet",
	providers: [AuthenticationService]
})
export class LoggedInRouterOutlet extends RouterOutlet {
	private parentRouter: Router;
	private publicRoutes: string[];

	constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader, _parentRouter: Router, @Attribute("name") nameAttr: string, private authenticationService: AuthenticationService) {
		super(_viewContainerRef, _loader, _parentRouter, nameAttr);

		this.parentRouter = _parentRouter;
		this.publicRoutes = ["login"];
	}

	public activate(instruction: ComponentInstruction) {
		if (this.canActivate(instruction.urlPath)) {
			return super.activate(instruction);
		}

		this.parentRouter.navigate(["Login"]);
	}

	public canActivate(url) {
		return this.publicRoutes.indexOf(url) !== -1 || this.authenticationService.isLoggedIn();
	}
}