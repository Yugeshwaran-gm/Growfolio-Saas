from django.urls import path
from .views import CandidateReceivedContactsView, DeleteSearchHistoryView, RecruiterSearchHistoryListView, RecruiterSentContactsView, SaveProfileView, SaveSearchHistoryView, SavedProfilesListView, DeleteSavedProfileView, SendContactRequestView, UpdateContactStatusView, UpdateSavedProfileNotesView

urlpatterns = [
    path("save-profile/", SaveProfileView.as_view()),
    path("saved-profiles/", SavedProfilesListView.as_view()),
    path(
        "saved-profiles/<int:pk>/delete/",
        DeleteSavedProfileView.as_view()
    ),

    path(
        "saved-profiles/<int:pk>/notes/",
        UpdateSavedProfileNotesView.as_view()
    ),
    path("search-history/save/", SaveSearchHistoryView.as_view()),

    path("search-history/", RecruiterSearchHistoryListView.as_view()),

    path(
        "search-history/<int:pk>/delete/",
        DeleteSearchHistoryView.as_view()
    ),
    path("contact/send/", SendContactRequestView.as_view()),

    path("contact/sent/", RecruiterSentContactsView.as_view()),

    path("contact/received/", CandidateReceivedContactsView.as_view()),

    path("contact/<int:pk>/status/", UpdateContactStatusView.as_view()),


]