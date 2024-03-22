from django.contrib.auth.models import User, Group
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        groups = serializers.HyperlinkedRelatedField(
            view_name='auth:group-detail',
            queryset=Group.objects.all(),
            lookup_field='pk',
            many=True,
        )
        data = super().validate(attrs)

        user = self.user
        groups = GroupSerializer(Group.objects.filter(user=user.id), many=True).data

        data["username"] = user.username
        data["isSuperUser"] = user.is_superuser
        data["groups"] = groups


        return data


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name',)
    
class UserSerializer(serializers.ModelSerializer):
    groups = serializers.HyperlinkedRelatedField(
        view_name='auth:group-detail',
        queryset=Group.objects.all(),
        lookup_field='pk',
        many=True,
    )
    class Meta:
        model = User
        fields = ('username', 'password', 'is_superuser', 'groups')

    def create(self, validated_data):
        groups_data = validated_data.pop('groups')
        password = make_password(validated_data.pop('password'))
        user = User.objects.create(**validated_data | {'password': password} )
        print(groups_data)
        for group_data in groups_data:
            print(group_data)
            user.groups.add(Group.objects.get(name=group_data).pk)
        return user