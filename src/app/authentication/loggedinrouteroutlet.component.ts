import {Router, RouterOutlet, RouterOutletMap, RouterLink, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "./../authentication/authentication.service.ts";
import {ElementRef, OnDestroy, Directive, Attribute, ViewContainerRef, ComponentFactoryResolver, Injector, ResolvedReflectiveProvider} from "@angular/core";

@Directive({
	selector: "router-outlet",
	providers: [AuthenticationService]
})
export class LoggedInRouterOutlet extends RouterOutlet {
	private parentRouter: Router;
	private publicRoutes: string[];

	constructor(parentOutletMap: RouterOutletMap, location: ViewContainerRef, resolver: ComponentFactoryResolver, name: string, private authenticationService: AuthenticationService) {
		super(parentOutletMap, location, resolver, name);

		//this.parentRouter = parentOutletMap;
		this.publicRoutes = ["login"];
	}

	public activate(activatedRoute: ActivatedRoute, loadedResolver: ComponentFactoryResolver, loadedInjector: Injector, providers: ResolvedReflectiveProvider[], outletMap: RouterOutletMap) {
		if (this.canActivate(activatedRoute.url)) {
			return super.activate(activatedRoute, loadedResolver, loadedInjector, providers, outletMap);
		}

		this.parentRouter.navigate(["Login"]);
	}

	public canActivate(url) {
		return this.publicRoutes.indexOf(url) !== -1 || this.authenticationService.isLoggedIn();
	}
}