from django.db import models

class User(models.Model):
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    password = models.CharField(max_length=100)
    is_caretaker = models.BooleanField(default=False)
    caretaker_email = models.EmailField(null=True, blank=True)
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
    pharmacy_name = models.CharField(max_length=255, blank=True, null=True)  # Optional field
    pharmacy_address = models.TextField(blank=True, null=True)  # Optional field
    name = models.CharField(max_length=255, blank=True, null=True, default='Unknown')  # Default value set
    date_prescribed = models.DateField(blank=True, null=True, default=None)  # Default value set
    quantity = models.IntegerField(blank=True, null=True, default=0)  # Default value set
    frequency = models.CharField(max_length=255, blank=True, null=True, default='Unknown')  # Default value set
    directions = models.TextField(blank=True, null=True, default='No directions provided')  # Default value set
    refills_remaining = models.IntegerField(blank=True, null=True, default=0)
    last_taken = models.DateTimeField(blank=True, null=True, default=None)  

class CaretakerVerification(models.Model):
    token = models.CharField(max_length=255, unique=True)
    caretaker_email = models.EmailField()
    patient_email = models.EmailField()
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patient_email} verified by {self.caretaker_email}"

class PatientLog(models.Model):
    patient_email = models.EmailField()
    caretaker_email = models.EmailField()
    description = models.CharField(max_length=2500, blank=True, null=True)
    datetime = models.DateTimeField()
    