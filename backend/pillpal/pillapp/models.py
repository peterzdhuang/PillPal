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

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medications")
    name = models.CharField(max_length=255, verbose_name="Medication Name")
    dosage = models.CharField(max_length=50, verbose_name="Dosage", help_text="e.g. 500mg")
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, verbose_name="Frequency")
    first_dose = models.TimeField(null=True, blank=True, verbose_name="First Dose")
    second_dose = models.TimeField(null=True, blank=True, verbose_name="Second Dose")
    quantity = models.IntegerField(verbose_name="Quantity", help_text="Number of pills")

    def __str__(self):
        return f"{self.name} - {self.dosage}"