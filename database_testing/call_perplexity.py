perplexity_api_key = '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'

import requests
import ast

url = "https://api.perplexity.ai/chat/completions"
content = '''
Welcome Back to the University of Washington!
The Returning Student Process is designed for undergraduate or professional-level students wishing to return to the University of Washington after an absence of one quarter or more (excluding summer quarter).
The following steps will guide you through the process to reactivate your student account and prepare you to register for a future quarter. Once you have submitted your Returning Student Request Form, you’ll be able to clear any holds you may have on your registration, and then confirm your intention to enroll through the Enrollment Confirmation System.
You may request to return to the University of Washington if you:

Have been away for more than one quarter (excluding summer quarter). Withdrawing from one quarter and not attending the subsequent quarter constitutes an absence of two consecutive quarters, which triggers the need to submit the Returning Student Request Form, AND
Have not obtained a degree in their last enrolled student category, either from the University of Washington or from another institution.

The ability to return as a student to the University of Washington is granted at the discretion of the University.
Eligibility factors which may be considered include, but are not limited to:

space availability in the major in which you were previously enrolled
activities during the period in which you were not enrolled
prior disciplinary action

Ready to Return? Get Started in Five Easy Steps
Step One: Returning Student Request Form
Complete and submit the Returning Student Request Form by the deadline date and time. We’ll collect your current contact information and additional data that we need to reactivate your student account.
This form is only for undergraduate and professional students who have not completed their UW degree.

Do not complete this form if you:

have already graduated
are a Graduate student
are a Non-Matriculated student



Returning Student Request Form
Step Two: Email Confirmation
Watch for an email from your campus registration team confirming that your Returning Student Request Form has been processed.

UW Seattle: regoff@uw.edu
UW Tacoma: reguwt@uw.edu
UW Bothell: uwbreg@uw.edu

Once you have been notified that your Returning Student Request Form has been processed you will receive an email prompting you to confirm your enrollment for the returning quarter you indicated.
Step Three: Check and Clear Any Registration Holds
After you receive an offer to return, log in to Log into MyUW and check on any holds that may prevent you from registering. These could be placed on your account for tuition and fees still owed from a prior quarter, behavioral holds, departmental holds related to satisfactory academic progress, or any other holds associated with blocking registration until you take the required action.
We encourage you to resolve whatever registration holds might be on your account first before proceeding to Step Five.
Step Four: Meet with your Adviser
To prepare for your transition to campus, meet with your academic adviser to plan your class schedule for your return quarter. Remember to check Log into MyUW for information about registering for classes.
Step Five: Confirm Your Quarter to Return
When you are ready, confirm your enrollment for the quarter you wish to return to the UW.
You will be required to pay a non-refundable Enrollment Confirmation Fee:



UW Bothell
UW Seattle
UW Tacoma




$60
$80
$60



Completing the Enrollment Confirmation step is required before you will be allowed to register and to continue your studies.

Residency Alert
Be advised that students returning to the University of Washington may not necessarily be readmitted under their previous residency classification. It is highly suggested that after you register for classes you check your tuition statement to ensure the tuition rate and fees are charged correctly. Students should be prepared to complete any necessary application and documents required to correct their classification with the Residency Office.

Returning Student Deadlines
You must complete all steps of the Returning Student process, including registering for classes for your return quarter by the end of the Returning Student Process Deadline day of the quarter you wish to return.



Quarter
Step One: Application Request Submission Deadline @ 5pm
Steps Two-Five: Completion Deadline*




Autumn 2024
September 24, 2024
October 4, 2024


Winter 2025
January 3, 2025
January 17, 2025


Spring 2025
March 28, 2025
April 4, 2025


Summer 2025
June 20, 2025
July 3, 2025


Autumn 2025
September 22, 2025
October 3, 2025


Winter 2026
January 2, 2026
January 16, 2026



UW Bothell and UW Tacoma
Returning Students to UW Bothell and UW Tacoma may have unique deadlines and other requirements for resuming your studies. Check with your respective campus registration team for more information. If you have any questions on the Returning Student Process, email your campus registration team.



Campus
Registration Team
Resource
EC Fee




UW Bothell
uwbreg@uw.edu
Returning Student Process
$60


UW Tacoma
reguwt@uw.edu
Returning Student Re-enrollment
$60



Graduate Students
Students previously registered in the Graduate School who have failed to maintain graduate student status (on-leave status was not secured or registration was not maintained) but wish to resume studies within the same degree program must file a request for reinstatement to the Graduate School.
Graduate students who are returning from official on-leave status do not complete the Returning Student Request Form. Review the Graduate On-Leave Status for on-leave eligibility, the procedure for requesting leave, and information about reinstatement.
For questions regarding on-leave status or the graduate reinstatement process, please contact the Graduate Program Advisor within your graduate program and/or Graduate Enrollment Management Services at uwgrad@uw.edu or 206-685-2630.
Productivity Platforms
Please be aware that the UW G Suite and/or UW Office 365 email & productivity platform account(s) and data that you create with your UW email address are temporary and will expire when you graduate and/or separate from the UW. However, you do have the ability to forward your UW email address to a personal, non-UW email address as a student and upon separation from the UW.
'''




payload = {
    "model": "llama-3.1-sonar-small-128k-online",
    "messages": [
        {
            "role": "system",
            "content": "Give a python list of keywords for the given text and give a two paragraph summary of the text, specifically focused on the keywords"
        },
        {
            "role": "user",
            "content": content
        }
    ],
    "max_tokens": 1000,
    "temperature": 0.2,
    "top_p": 0.9,
    "return_citations": True,
    "search_domain_filter": ["perplexity.ai"],
    "return_images": False,
    "return_related_questions": False,
    "search_recency_filter": "month",
    "top_k": 0,
    "stream": False,
    "presence_penalty": 0,
    "frequency_penalty": 1
}
headers = {
    "Authorization": f"Bearer {perplexity_api_key}",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)
text = response.text
lit_text = ast.literal_eval(text)

chat_response = lit_text['choices'][0]['message']['content']

print(chat_response)