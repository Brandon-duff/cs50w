from django.urls import path

from . import views

urlpatterns = [
    path("", views.IndexListView.as_view(), name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_auction", views.new_auction, name="new_auction"),
    path("auction/<int:pk>/", views.auction_view, name='auction_view')
]
