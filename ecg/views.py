from django.views.defaults import page_not_found, server_error

def handler_404(request, exception):
    return page_not_found(request, exception, template_name="ecg/errores/404.html")



