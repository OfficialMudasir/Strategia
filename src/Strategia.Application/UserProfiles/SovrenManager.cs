using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Sovren;
using Sovren.Models;
using Sovren.Models.API.DataEnrichment.Skills.Response;
using Sovren.Models.API.Parsing;
using Sovren.Models.Resume;
using Strategia.Authorization.Users;
using Strategia.UserProfiles.Exporting;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Strategia.UserProfiles
{
    public class SovrenManager : StrategiaAppServiceBase
    {
        private readonly ISovrenClient _client;

        public SovrenManager(ISovrenClient client)
        {
            _client = client;
        }

        public async Task<ParsedResume> ParseResume(byte[] resume)
        { 

            ParsedResume result = null;



            try
            {
               if(resume != null)
                {
                    Document doc = new Document(resume, DateTime.Now);
                    ParseRequest request = new ParseRequest(doc, new ParseOptions());
                    ParseResumeResponse response = await _client.ParseResume(request);
                    //if we get here, it was 200-OK and all operations succeeded

                    //string jsonData = "{\r\n  \"ContactInformation\": {\r\n    \"CandidateName\": {\r\n      \"FormattedName\": \"John W. Smith\",\r\n      \"GivenName\": \"John\",\r\n      \"MiddleName\": \"W.\",\r\n      \"FamilyName\": \"Smith\"\r\n    },\r\n    \"EmailAddresses\": [\r\n      \"jwsmith@colostate.edu\"\r\n    ],\r\n    \"Location\": {\r\n      \"CountryCode\": \"US\",\r\n      \"PostalCode\": \"80525\",\r\n      \"Regions\": [\r\n        \"CO\"\r\n      ],\r\n      \"Municipality\": \"Fort Collins\",\r\n      \"StreetAddressLines\": [\r\n        \"2002 Front Range Way\"\r\n      ]\r\n    }\r\n  },\r\n  \"ProfessionalSummary\": \"John W. Smith\\n2002 Front Range Way Fort Collins, CO 80525 jwsmith@colostate.edu\\n\\nFour years experience in early childhood development with a diverse background in the care of special needs children and adults.\\nAdult Care Experience\\n• Determined work placement for 150 special needs adult clients.\\n• Maintained client databases and records.\\n• Coordinated client contact with local health care professionals on a monthly basis.\\n• Managed 25 volunteer workers.\\n\\nChildcare Experience\\n• Coordinated service assignments for 20 part-time counselors and 100 client families.\\n• Oversaw daily activity and outing planning for 100 clients.\\n• Assisted families of special needs clients with researching financial assistance and healthcare.\\n• Assisted teachers with managing daily classroom activities.\\n• Oversaw daily and special student activities.\",\r\n  \"Education\": {\r\n    \"HighestDegree\": {\r\n      \"Name\": {\r\n        \"Raw\": \"BS in Early Childhood Development\",\r\n        \"Normalized\": \"BSc\"\r\n      },\r\n      \"Type\": \"bachelors\"\r\n    },\r\n    \"EducationDetails\": [\r\n      {\r\n        \"Id\": \"DEG-1\",\r\n        \"Text\": \"University of Arkansas at Little Rock, Little Rock, AR\\n\\n• BS in Early Childhood Development (1999)\",\r\n        \"SchoolName\": {\r\n          \"Raw\": \"University of Arkansas at Little Rock\",\r\n          \"Normalized\": \"University of Arkansas at Little Rock\"\r\n        },\r\n        \"SchoolType\": \"university\",\r\n        \"Location\": {\r\n          \"CountryCode\": \"US\",\r\n          \"Regions\": [\r\n            \"AR\"\r\n          ],\r\n          \"Municipality\": \"Little Rock\"\r\n        },\r\n        \"Degree\": {\r\n          \"Name\": {\r\n            \"Raw\": \"BS in Early Childhood Development\",\r\n            \"Normalized\": \"BSc\"\r\n          },\r\n          \"Type\": \"bachelors\"\r\n        },\r\n        \"Majors\": [\r\n          \"Early Childhood\"\r\n        ],\r\n        \"LastEducationDate\": {\r\n          \"Date\": \"1999-01-01\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        },\r\n        \"EndDate\": {\r\n          \"Date\": \"1999-01-01\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        }\r\n      },\r\n      {\r\n        \"Id\": \"DEG-2\",\r\n        \"Text\": \"• BA in Elementary Education (1998)\\n• GPA (4.0 Scale): Early Childhood Development - 3.8, Elementary Education - 3.5, Overall 3.4.\\n• Dean's List, Chancellor's List\",\r\n        \"SchoolType\": \"UNSPECIFIED\",\r\n        \"Degree\": {\r\n          \"Name\": {\r\n            \"Raw\": \"BA in Elementary Education\",\r\n            \"Normalized\": \"bachelors\"\r\n          },\r\n          \"Type\": \"bachelors\"\r\n        },\r\n        \"Majors\": [\r\n          \"Early Childhood Development\"\r\n        ],\r\n        \"GPA\": {\r\n          \"Score\": \"4.0\",\r\n          \"ScoringSystem\": \"GPA\",\r\n          \"MaxScore\": \"4.0\",\r\n          \"MinimumScore\": \"0\",\r\n          \"NormalizedScore\": 1.0\r\n        },\r\n        \"LastEducationDate\": {\r\n          \"Date\": \"1998-01-01\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        },\r\n        \"EndDate\": {\r\n          \"Date\": \"1998-01-01\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        }\r\n      }\r\n    ]\r\n  },\r\n  \"EmploymentHistory\": {\r\n    \"ExperienceSummary\": {\r\n      \"Description\": \"John W. Smith is experienced in:  Healthcare (Specialized Nurses); and Insurance and Finance. John W. Smith appears to be a low-to-mid level candidate, with 4 years of experience, with 4 years of management experience, including a low-level position.\",\r\n      \"MonthsOfWorkExperience\": 48,\r\n      \"MonthsOfManagementExperience\": 48,\r\n      \"ExecutiveType\": \"NONE\",\r\n      \"AverageMonthsPerEmployer\": 48,\r\n      \"FulltimeDirectHirePredictiveIndex\": 100,\r\n      \"ManagementStory\": \"Starting on 1/1/1999, the candidate held the following low-level management position for 4 years:\\n\\tTitle: Counseling Supervisor for The Wesley Center\",\r\n      \"CurrentManagementLevel\": \"low-level\",\r\n      \"ManagementScore\": 25\r\n    },\r\n    \"Positions\": [\r\n      {\r\n        \"Id\": \"POS-1\",\r\n        \"Employer\": {\r\n          \"Name\": {\r\n            \"Probability\": \"Confident\",\r\n            \"Raw\": \"The Wesley Center\",\r\n            \"Normalized\": \"The Wesley Center\"\r\n          },\r\n          \"Location\": {\r\n            \"CountryCode\": \"US\",\r\n            \"Regions\": [\r\n              \"Arkansas\"\r\n            ],\r\n            \"Municipality\": \"Little Rock\"\r\n          }\r\n        },\r\n        \"IsSelfEmployed\": false,\r\n        \"IsCurrent\": false,\r\n        \"JobTitle\": {\r\n          \"Raw\": \"Counseling Supervisor\",\r\n          \"Normalized\": \"Counseling Supervisor\",\r\n          \"Probability\": \"Confident\"\r\n        },\r\n        \"StartDate\": {\r\n          \"Date\": \"1999-01-01\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        },\r\n        \"EndDate\": {\r\n          \"Date\": \"2002-12-31\",\r\n          \"IsCurrentDate\": false,\r\n          \"FoundYear\": true,\r\n          \"FoundMonth\": false,\r\n          \"FoundDay\": false\r\n        },\r\n        \"JobType\": \"directHire\",\r\n        \"JobLevel\": \"Experienced (non-manager)\",\r\n        \"TaxonomyPercentage\": 0,\r\n        \"Description\": \"1997-1999\\tClient Specialist, Rainbow Special Care Center, Little Rock, Arkansas 1996-1997\\tTeacher's Assistant, Cowell Elementary, Conway, Arkansas\"\r\n      }\r\n    ]\r\n  },\r\n  \"Skills\": {\r\n    \"Raw\": [\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"Childcare\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"client contact\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"client databases\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"Coordinated\"\r\n      },\r\n      {\r\n        \"MonthsExperience\": {\r\n          \"Value\": 48\r\n        },\r\n        \"LastUsed\": {\r\n          \"Value\": \"2002-12-31\"\r\n        },\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"WORK HISTORY\",\r\n            \"Id\": \"POS-1\"\r\n          }\r\n        ],\r\n        \"Name\": \"Counseling\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"Determined\"\r\n      },\r\n      {\r\n        \"LastUsed\": {\r\n          \"Value\": \"1999-01-01\"\r\n        },\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          },\r\n          {\r\n            \"SectionType\": \"EDUCATION\",\r\n            \"Id\": \"DEG-1\"\r\n          },\r\n          {\r\n            \"SectionType\": \"EDUCATION\",\r\n            \"Id\": \"DEG-2\"\r\n          }\r\n        ],\r\n        \"Name\": \"Early Childhood Development\"\r\n      },\r\n      {\r\n        \"LastUsed\": {\r\n          \"Value\": \"1998-01-01\"\r\n        },\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"EDUCATION\",\r\n            \"Id\": \"DEG-2\"\r\n          }\r\n        ],\r\n        \"Name\": \"Elementary Education\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"financial\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"health care\"\r\n      },\r\n      {\r\n        \"FoundIn\": [\r\n          {\r\n            \"SectionType\": \"SUMMARY\"\r\n          }\r\n        ],\r\n        \"Name\": \"researching\"\r\n      }\r\n    ]\r\n  },\r\n  \"LanguageCompetencies\": [\r\n    {\r\n      \"Language\": \"English\",\r\n      \"LanguageCode\": \"en\",\r\n      \"FoundInContext\": \"[RESUME_LANGUAGE]\"\r\n    }\r\n  ],\r\n  \"Achievements\": [\r\n    \"Dean's List, Chancellor's List\"\r\n  ],\r\n  \"ResumeMetadata\": {\r\n    \"FoundSections\": [\r\n      {\r\n        \"FirstLineNumber\": 3,\r\n        \"LastLineNumber\": 20,\r\n        \"SectionType\": \"SUMMARY\",\r\n        \"HeaderTextFound\": \"Career Summary\"\r\n      },\r\n      {\r\n        \"FirstLineNumber\": 21,\r\n        \"LastLineNumber\": 24,\r\n        \"SectionType\": \"WORK HISTORY\",\r\n        \"HeaderTextFound\": \"Employment History\"\r\n      },\r\n      {\r\n        \"FirstLineNumber\": 25,\r\n        \"LastLineNumber\": 31,\r\n        \"SectionType\": \"EDUCATION\",\r\n        \"HeaderTextFound\": \"Education\"\r\n      }\r\n    ],\r\n    \"ResumeQuality\": [\r\n      {\r\n        \"Level\": \"Major Issues Found\",\r\n        \"Findings\": [\r\n          {\r\n            \"QualityCode\": \"303\",\r\n            \"SectionIdentifiers\": [\r\n              {\r\n                \"SectionType\": \"SUMMARY\",\r\n                \"Id\": \"0\"\r\n              }\r\n            ],\r\n            \"Message\": \"These sections are longer than the work history and education sections combined. This may indicate a problem with section headers, formatting, or content.\"\r\n          }\r\n        ]\r\n      },\r\n      {\r\n        \"Level\": \"Data Missing\",\r\n        \"Findings\": [\r\n          {\r\n            \"QualityCode\": \"212\",\r\n            \"Message\": \"A phone number was not found in the contact information. A resume should always include a phone number.\"\r\n          },\r\n          {\r\n            \"QualityCode\": \"226\",\r\n            \"Message\": \"We found no work history positions within the past year. A resume should include work history information, including time off, for the most recent year.\"\r\n          },\r\n          {\r\n            \"QualityCode\": \"232\",\r\n            \"SectionIdentifiers\": [\r\n              {\r\n                \"SectionType\": \"DEG-2\"\r\n              }\r\n            ],\r\n            \"Message\": \"Every degree in a resume should be associated with a school.\"\r\n          }\r\n        ]\r\n      }\r\n    ],\r\n    \"ReservedData\": {\r\n      \"Names\": [\r\n        \"John W. Smith\"\r\n      ],\r\n      \"EmailAddresses\": [\r\n        \"jwsmith@colostate.edu\"\r\n      ],\r\n      \"OtherData\": [\r\n        \"2002 Front Range Way\"\r\n      ]\r\n    },\r\n    \"PlainText\": \"Functional Resume Sample\\n\\n\\nCareer Summary\\nJohn W. Smith\\n2002 Front Range Way Fort Collins, CO 80525 jwsmith@colostate.edu\\n\\nFour years experience in early childhood development with a diverse background in the care of special needs children and adults.\\nAdult Care Experience\\n• Determined work placement for 150 special needs adult clients.\\n• Maintained client databases and records.\\n• Coordinated client contact with local health care professionals on a monthly basis.\\n• Managed 25 volunteer workers.\\n\\nChildcare Experience\\n• Coordinated service assignments for 20 part-time counselors and 100 client families.\\n• Oversaw daily activity and outing planning for 100 clients.\\n• Assisted families of special needs clients with researching financial assistance and healthcare.\\n• Assisted teachers with managing daily classroom activities.\\n• Oversaw daily and special student activities.\\n\\nEmployment History\\n\\n1999-2002\\tCounseling Supervisor, The Wesley Center, Little Rock, Arkansas. 1997-1999\\tClient Specialist, Rainbow Special Care Center, Little Rock, Arkansas 1996-1997\\tTeacher's Assistant, Cowell Elementary, Conway, Arkansas\\n\\nEducation\\nUniversity of Arkansas at Little Rock, Little Rock, AR\\n\\n• BS in Early Childhood Development (1999)\\n• BA in Elementary Education (1998)\\n• GPA (4.0 Scale): Early Childhood Development - 3.8, Elementary Education - 3.5, Overall 3.4.\\n• Dean's List, Chancellor's List\",\r\n    \"DocumentLanguage\": \"en\",\r\n    \"DocumentCulture\": \"en-US\",\r\n    \"ParserSettings\": \"Coverage.PersonalAttributes = True; Coverage.Training = True; Culture.CountryCodeForUnitedKingdomIsUK = True; Culture.DefaultCountryCode = US; Culture.Language = English; Culture.PreferEnglishVersionIfTwoLanguagesInDocument = False; Data.UserDefinedParsing = False; Data.UseV2SkillsTaxonomy = True; OutputFormat.AssumeCompanyNameFromPrecedingJob = False; OutputFormat.ContactMethod.PackStyle = Split; OutputFormat.DateOutputStyle = ExplicitlyKnownDateInfoOnly; OutputFormat.NestJobsBasedOnDateRanges = True; OutputFormat.NormalizeRegions = False; OutputFormat.SimpleCustomLinkedIn = False; OutputFormat.SkillsStyle = Default; OutputFormat.StripParsedDataFromPositionHistoryDescription = True; OutputFormat.TelcomNumber.Style = Raw; OutputFormat.XmlFormat = HrXmlResume25\",\r\n    \"DocumentLastModified\": \"2023-09-18\"\r\n  }\r\n}";
                    //result = JsonConvert.DeserializeObject<ParsedResume>(jsonData);

                    result = response.Value.ResumeData;
                }

                return result;

            }
            catch (SovrenException e)
            {
                //this was an outright failure, always try/catch for SovrenExceptions when using the SovrenClient
                Console.WriteLine($"Error: {e.SovrenErrorCode}, Message: {e.Message}");
            }


            return result;


        }

        public async Task<GetSkillsTaxonomyResponse> GetSkills()
        {
            try
            {
  
               var skills = await _client.GetSkillsTaxonomy();
               return skills;
            }
            catch (SovrenException e)
            {
                throw e;
            }
        }

    }

}
