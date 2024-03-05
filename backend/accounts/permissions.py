from rest_framework import permissions


class IsManagerOrReadOnly(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='Manager').exists()
    
class IsWaitStaffOrReadOnly(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='WaitStaff').exists()
    
class IsKitchenStaffOrReadOnly(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='KitchenStaff').exists()   