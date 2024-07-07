/**
 * 
 * All scoreGiven values MUST be positive number (including 0). 
 *     scoreMaximum represents the denominator and MUST be present when scoreGiven is present. 
 *     When scoreGiven is not present or null, this indicates there is presently no score for that user, and the platform should clear any previous score value it may have previously received from the tool and stored for that user and line item.

The platform MUST support scoreGiven higher than scoreMaximum. For example, if the tool passes normalized score, ranging from 0 to 1, the scoreMaximum would be 1. scoreGiven: 1.1 would be a valid score.

A scoreGiven MAY be used to pass actual points value, in which case a value for scoreMaximum would be the maximum points possible for that student. For example, the tool MAY pass scoreGiven: 1, scoreMaximum: 3 instead of scoreGiven: 0.33333, scoreMaximum: 1.

Usually a platform will just re-scale the value to the line item's scoreMaximum. For example, if the line item maximum is 6 in the above example, then it would show 2 points as the given score; accordingly, the result would contain resultScore of 2 and resultMaximum of 6.
 * 
export enum CourseState {
  NOTSTARTED = "NOTSTARTED",
  INPROGRESS = "INPROGRESS",
  FINISHEDWATCHING = "FINISHEDWATCHING",
  COMPLETED = "COMPLETED",
}

export const CourseStateProgress = {
  [CourseState.NOTSTARTED]: 0,
  [CourseState.INPROGRESS]: 25,
  [CourseState.FINISHEDWATCHING]: 50,
  [CourseState.COMPLETED]: 100,
};
 */

/**
 * 
 * { 
    "userId" : "200",
    "scoreGiven" : 83,
    "scoreMaximum" : 100,
    "comment" : "This is exceptional work.",
    "activityProgress" : "Completed",
    "gradingProgress": "FullyGraded"
 }
viz. const gradeObj = {
      userId: idtoken.user,
      scoreGiven: score,
      scoreMaximum: 100,
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded'
    }

----------------------
 activityProgress MUST be used to indicate to the tool platform the status of the user towards the activity's completion.

The activityProgress property of a score MUST have one of the following values:

Initialized – the user has not started the activity, or the activity has been reset for that student.
Started – the activity associated with the line item has been started by the user to which the result relates.
InProgress - the activity is being drafted and is available for comment.
Submitted - the activity has been submitted at least once by the user but the user is still able make further submissions.
Completed – the user has completed the activity associated with the line item.
It is up to the tool to determine the appropriate 'activityProgress' value. A tool platform MAY ignore statuses it does not support.

The activityProgress property SHOULD be updated and transmitted to the platform anytime any meaningful state change in the activity takes place. For example, 
if a student begins an activity the activityProgress should be updated to 'Started' and sent to the platform.

----------------------
gradingProgress MUST be used to indicate to the platform the status of the grading process, including allowing to inform when human intervention is needed.

The gradingProgress property of a score must have one of the following values:

FullyGraded: The grading process is completed; the score value, if any, represents the current Final Grade; the gradebook may display the grade to the learner
Pending: Final Grade is pending, but does not require manual intervention; if a Score value is present, it indicates the current value is partial and may be updated.
PendingManual: Final Grade is pending, and it does require human intervention; if a Score value is present, it indicates the current value is partial and may be updated during the manual grading.
Failed: The grading could not complete.
NotReady: There is no grading process occurring; for example, the student has not yet made any submission.
It is up to the tool to determine the appropriate gradingProgress value. A tool platform MAY ignore scores that are not FullyGraded as those have to be considered partial grades.

The gradingProgress property SHOULD be updated and transmitted to the platform anytime any meaningful state change in the activity takes place.

*/
export class Grades {}
