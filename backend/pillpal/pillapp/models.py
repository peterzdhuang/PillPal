from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    is_caretaker = models.BooleanField()
    patient_email = models.EmailField(null=True, blank=True)
    followers = models.ManyToManyField('self', symmetrical=False)

class Medication(models.Model):
    FREQUENCY_CHOICES = [
        ('once', 'Once a day'),
        ('twice', 'Twice a day'),
        ('thrice', 'Three times a day'),
        ('custom', 'Custom'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medications")
    pharmacy_name = models.CharField(max_length=255, verbose_name="Pharmacy Name")
    address = models.CharField(max_length=255, verbose_name="Pharmacy Address")
    name = models.CharField(max_length=255, verbose_name="Medication Name")
    dosage = models.CharField(max_length=50, verbose_name="Dosage", help_text="e.g. 500mg")
    date = models.DateField(verbose_name="Date Prescribed")
    quantity = models.IntegerField(verbose_name="Quantity", help_text="Number of pills")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, verbose_name="Frequency")
    directions = models.TextField(verbose_name="Directions", help_text="How and when to take the medication")
    refills = models.IntegerField(verbose_name="Refills Remaining", default=0)
 