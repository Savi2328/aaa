import json
from django.contrib.auth import authenticate, login, logout

#proba
from django.contrib.auth.models import User

from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({'detail':'CSRF cookie set'})

@require_POST
def api_login(request):
    data = json.loads(request.body.decode('utf-8'))

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "")

    user = authenticate(
        request,
        username=username,          # ✅ POPRAWIONE
        password=password
    )

    if user is None:
        return JsonResponse(
            {'detail': 'Invalid username or password'},
            status=400
        )

    login(request, user)
    return JsonResponse({'detail': 'Logged in successfully'})

@require_POST
def api_logout(request):
    logout(request)
    return JsonResponse({'detail':'Logged out successfully'})