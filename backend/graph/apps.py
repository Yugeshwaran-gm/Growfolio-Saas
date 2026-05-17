from django.apps import AppConfig


class GraphConfig(AppConfig):
    name = 'graph'

    def ready(self):
        """Register signal handlers when app is ready"""
        import graph.signals  # noqa
