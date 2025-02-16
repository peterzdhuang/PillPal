from django.db import models

class User(models.Model):
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    password = models.CharField(max_length=100)
    is_caretaker = models.BooleanField(default=False)
    patient_email = models.EmailField(null=True, blank=True)
    followers = models.ManyToManyField('self', symmetrical=False, default=None, blank=True)
    notifications = models.BooleanField(default=True)

class Medication(models.Model):
    FREQUENCY_CHOICES = [
        ('once', 'Once a day'),
        ('twice', 'Twice a day'),
        ('thrice', 'Three times a day'),
        ('custom', 'Custom'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medications')
    pharmacy_name = models.CharField(max_length=255)
    pharmacy_address = models.TextField()
    name = models.CharField(max_length=255)  # pillName from frontend
    date_prescribed = models.DateField()     # date from frontend
    quantity = models.IntegerField()         # numberOfPills from frontend
    frequency = models.CharField(max_length=255)
    directions = models.TextField()
    refills_remaining = models.IntegerField()  # refills from frontend