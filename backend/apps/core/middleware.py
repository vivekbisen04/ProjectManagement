from django.http import JsonResponse
from apps.organizations.models import Organization


class OrganizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        organization_slug = request.headers.get('X-Organization-Slug')
        
        if organization_slug:
            try:
                organization = Organization.objects.get(slug=organization_slug, is_active=True)
                request.organization = organization
            except Organization.DoesNotExist:
                # Don't fail for GraphQL requests - let the resolver handle it
                request.organization = None
        else:
            request.organization = None

        response = self.get_response(request)
        return response