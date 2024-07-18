from django.shortcuts import render
from django.http import HttpResponse, Http404
from datetime import date

# Create your views here.

all_posts = [
    {
        "slug": "hike-in-the-mountains",
        "image": "mountains.png",
        "author": "Fabricio",
        "date": date(2024, 5, 21),
        "title": "Mountain Hiking",
        "excerpt": "There is nothing like the views you get when hiking in the mountains!",
        "content": """ 
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Saepe commodi alias doloribus amet exercitationem unde illum sint! 
            Quibusdam aperiam voluptas tempore nulla natus dolore, error repellat odit iure delectus optio?
        """
    },
    {
        "slug": "programming-is-fun",
        "image": "coding.png",
        "author": "Maximilian",
        "date": date(2022, 3, 10),
        "title": "Programming Is Great!",
        "excerpt": "Did you ever spend hours searching that one error in your code? Yep - that's what happened to me yesterday...",
        "content": """
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis nobis
          aperiam est praesentium, quos iste consequuntur omnis exercitationem quam
          velit labore vero culpa ad mollitia? Quis architecto ipsam nemo. Odio.
        """
    },
    {
        "slug": "into-the-woods",
        "image": "woods.png",
        "author": "Maximilian",
        "date": date(2020, 8, 5),
        "title": "Nature At Its Best",
        "excerpt": "Nature is amazing! The amount of inspiration I get when walking in nature is incredible!",
        "content": """
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis nobis
          aperiam est praesentium, quos iste consequuntur omnis exercitationem quam
          velit labore vero culpa ad mollitia? Quis architecto ipsam nemo. Odio.
        """
    }
]


def get_date(post):
    return post['date']


def home_page(request):
    sorted_posts = sorted(all_posts, key=get_date)
    latest_posts = sorted_posts[-3:]
    response_data = render(request, "blog/home_page.html", {
        "posts": latest_posts
    })
    return HttpResponse(response_data)


def posts(request):
    response_data = render(request, "blog/all-posts.html", {
        "all_posts": all_posts
    })
    return HttpResponse(response_data)


def get_specific_post(request, slug):
    try:
        specified_post = next(
            post for post in all_posts if post['slug'] == slug)

        response_data = render(request, "blog/post-detail.html", {
            "post": specified_post
        })
        return HttpResponse(response_data)
    except:
        raise Http404()
