from rest_framework import permissions


class IsManagerOrReadOnly(permissions.DjangoModelPermissions):
    """
    Permissions for that allow any Read, but Write only from manager
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='Manager').exists()


class IsWaitStaffOrReadOnly(permissions.DjangoModelPermissions):
    """
    Permission that allows any Read, but Write only from WaitStaff
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='WaitStaff').exists()


class IsKitchenStaffOrReadOnly(permissions.DjangoModelPermissions):
    """
    Permission that allows any Read, but Write only from KitchenStaff
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.groups.filter(name='KitchenStaff').exists()
