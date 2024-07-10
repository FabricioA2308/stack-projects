from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseRedirect, Http404
from django.urls import reverse

monthly_challenges = {
    "january": 'January challenge!',
    "february": "February challenge!",
    "march": "March challenge!",
    "april": "April challenge!",
    "may": "May challenge!",
    "june": "June challenge!",
    "july": "July challenge!",
    "august": "August challenge!",
    "september": "September challenge!",
    "october": "October challenge!",
    "november": "November challenge!",
    "december": None
}

# Create your views here.


def index(request):
    months = list(monthly_challenges.keys())

    return render(request, "challenges/index.html", {
        "months": months
    })


def monthly_challenge_by_number(request, month):
    months = list(monthly_challenges.keys())

    if month > len(months) or month == 0:
        return HttpResponseNotFound("Not a valid month, please try again!")

    redirect_month = months[month - 1]
    redirect_path = reverse("month-challenge", args=[redirect_month])
    return HttpResponseRedirect(redirect_path)


def monthly_challenge(request, month):
    try:
        challenge_text = monthly_challenges[month]
        return render(request, "challenges/challenge.html", {
            "text": challenge_text,
            "month": month
        })
    except:
        raise Http404()
