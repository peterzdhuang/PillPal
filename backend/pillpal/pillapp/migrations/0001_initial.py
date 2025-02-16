

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=100)),
                ('is_caretaker', models.BooleanField()),
                ('patient_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('followers', models.ManyToManyField(to='pillapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pharmacy_name', models.CharField(max_length=255, verbose_name='Pharmacy Name')),
                ('address', models.CharField(max_length=255, verbose_name='Pharmacy Address')),
                ('name', models.CharField(max_length=255, verbose_name='Medication Name')),
                ('dosage', models.CharField(help_text='e.g. 500mg', max_length=50, verbose_name='Dosage')),
                ('date', models.DateField(verbose_name='Date Prescribed')),
                ('quantity', models.IntegerField(help_text='Number of pills', verbose_name='Quantity')),
                ('frequency', models.CharField(choices=[('once', 'Once a day'), ('twice', 'Twice a day'), ('thrice', 'Three times a day'), ('custom', 'Custom')], max_length=20, verbose_name='Frequency')),
                ('directions', models.TextField(help_text='How and when to take the medication', verbose_name='Directions')),
                ('refills', models.IntegerField(default=0, verbose_name='Refills Remaining')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medications', to='pillapp.user')),
            ],
        ),
    ]
