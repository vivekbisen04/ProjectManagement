from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('health/', lambda request: JsonResponse({'status': 'ok'}), name='health-check'),
]