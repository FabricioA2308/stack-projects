from django.shortcuts import render
from django.http import HttpResponse, Http404
from .models import Post

# Create your views here.


def home_page(request):
    sorted_posts = Post.objects.all().order_by("-date")[:3]

    response_data = render(request, "blog/home_page.html", {
        "posts": sorted_posts
    })
    return HttpResponse(response_data)


def posts(request):
    response_data = render(request, "blog/all-posts.html", {
        "all_posts": Post.objects.all()
    })
    return HttpResponse(response_data)


def get_specific_post(request, slug):
    try:
        specified_post = Post.objects.get(slug=slug)

        response_data = render(request, "blog/post-detail.html", {
            "post": specified_post,
            "tags": specified_post.caption.all()
        })
        return HttpResponse(response_data)
    except:
        raise Http404()
