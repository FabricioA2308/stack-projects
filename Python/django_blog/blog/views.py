from django.shortcuts import render
from django.views.generic.list import ListView
from django.views import View
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import Post
from .forms import CommentForm

# Create your views here.


class HomePageView(ListView):
    context_object_name = "posts"
    template_name = "blog/home-page.html"
    model = Post
    ordering = ["-date"]

    def get_queryset(self):
        query = super().get_queryset()
        data = query[:3]
        return data


class AllPostsView(ListView):
    context_object_name = "posts"
    template_name = "blog/all-posts.html"
    model = Post


class PostDetailView(View): # use either pk or slug type in the url query parameter, django does the rest
    
    def create_context_by_pk(self, pk, request): # avoid duplication
        post = Post.objects.get(pk=pk)
        stored_posts = request.session.get("stored_posts")
        
        if stored_posts is not None:
            is_saved_for_later = post.id in stored_posts
        else:
            is_saved_for_later = False
        
        context = {
            "post": post,
            "tags": post.caption.all(),
            "comment_form": CommentForm(),
            "comments": post.comments.all().order_by("-id"),
            "saved_for_later": is_saved_for_later
        }
        
        return context
        
    
    def get(self, request, pk):
        context = self.create_context_by_pk(pk=pk, request=request)
        return render(request, "blog/post-detail.html", context)
        
        
    def post(self, request, pk):
        comment_form = CommentForm(request.POST) # All fields from the form reach the view inside request.POST
        post = Post.objects.get(pk=pk, request=request)
        
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.post = post
            comment.save()
            return HttpResponseRedirect(reverse("post-detail", args=[pk]))
    
        context = self.create_context_by_pk(pk=pk)
        return render(request, "blog/post-detail.html", context)

 
class ReadLaterView(View):
    def get(self, request):
        stored_posts = request.session.get("stored_posts")
        
        context = {}
        
        if stored_posts is None or len(stored_posts) == 0:
            context["posts"] = []
            context["has_posts"] = False
        else:
            posts = Post.objects.filter(id__in=stored_posts)
            context["posts"] = posts
            context["has_posts"] = True
            
        return render(request, "blog/stored-posts.html", context)
            
    
    def post(self, request):
        stored_posts = request.session.get("stored_posts")
        
        if stored_posts is None:
            stored_posts = []
            
        post_id = int(request.POST["post_id"])
        
        if post_id not in stored_posts:
            stored_posts.append(post_id)
        else:
            stored_posts.remove(post_id)
            
        request.session["stored_posts"] = stored_posts
            
        return HttpResponseRedirect("/")