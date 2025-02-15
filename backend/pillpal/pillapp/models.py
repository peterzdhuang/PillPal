from django.db import models

# Create your models here.

class User(models.Model):
    role = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    followers = models.ManyToManyField('self', symmetrical=False)

class Pill(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)