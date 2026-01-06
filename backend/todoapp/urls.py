from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .auth_views import csrf, api_login, api_logout

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename='task')

urlpatterns = [
    path('csrf/', csrf),
    path('login/', api_login),
    path('logout/', api_logout),
    path('', include(router.urls)),
]

