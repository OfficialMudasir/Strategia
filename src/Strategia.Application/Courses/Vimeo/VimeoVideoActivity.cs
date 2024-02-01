using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Strategia.Courses.Vimeo
{
    public class VimeoVideoActivity
    {
        private static string VimeoApiUrl = "http://vimeo.com/api/v2/video/{0}.json";

        public VimeoVideoActivity() { }

        public static string VimeoImport(string videoId)
        {
            try
            {
                using (WebClient myDownloader = new WebClient())
                {
                    myDownloader.Encoding = Encoding.UTF8;

                    //Fetch and Calculate Video data and duration from VimeoApiUrl
                    string jsonResponse =  myDownloader.DownloadString(string.Format(VimeoApiUrl, videoId));
                    dynamic videoArray = JsonConvert.DeserializeObject(jsonResponse);

                    if (videoArray != null && videoArray.Count > 0)
                    {
                        int originalDurationSeconds = videoArray[0].duration;
                        videoArray[0].duration = SecondsToMinutes(originalDurationSeconds);
                    }

                    return JsonConvert.SerializeObject(videoArray);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public static string GetVideoId(string url)
        {
            // Regular expression to extract the Vimeo video ID
            Regex vimeoRegex = new Regex(@"(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)");
            Match vimeoMatch = vimeoRegex.Match(url);

            // If a match is found, return the Vimeo video ID, otherwise return null
            return vimeoMatch.Success ? vimeoMatch.Groups[1].Value : null;
        }

        public static bool IsVimeoUrl(string url)
        {
            // Regular expression to match Vimeo URLs
            Regex vimeoRegex = new Regex(@"^(https?:\/\/)?(www\.)?(vimeo\.com\/|player\.vimeo\.com\/video\/)[0-9]+");

            // Check if the URL matches the Vimeo pattern
            return vimeoRegex.IsMatch(url);
        }

        public static string SecondsToMinutes(int seconds)
        {
            int hours = seconds / 3600;
            int minutes = (seconds % 3600) / 60;
            int remainingSeconds = seconds % 60;

            string hoursText = hours > 0 ? $"{hours} hr{(hours > 1 ? "" : "")}, " : "";
            string minutesText = minutes > 0 ? $"{minutes} min{(minutes > 1 ? "" : "")}, " : "";
            string secondsText = (hours == 0 && minutes == 0) ? $"{remainingSeconds} sec{(remainingSeconds > 1 ? "" : "")}" : "";

            // Combine the text parts and remove trailing comma and space
            string duration = $"{hoursText}{minutesText}{secondsText}".TrimEnd(',', ' ');
            return duration;
        }

        public static string ConvertSecondsToReadable(decimal seconds)
        {
            if (seconds < 60)
            {
                return $"{seconds}sec";
            }
            int hours = (int)Math.Floor(seconds / 3600);
            int remainingSeconds = (int)Math.Floor(seconds % 3600);
            int minutes = (remainingSeconds / 60);
            return hours > 0 && minutes > 0 ? $"{hours} hr {minutes} min" : hours > 0 ? $"{hours} hr" : $"{minutes} min";
        }
        public static string ConvertSecondsToReadable(double seconds)
        {
            if (seconds < 60)
            {
                return $"{seconds}sec";
            }

            int hours = (int)Math.Floor(seconds / 3600);
            int remainingSeconds = (int)Math.Floor(seconds % 3600);
            int minutes = (remainingSeconds / 60);
            return hours > 0 && minutes > 0 ? $"{hours} hr {minutes} min" : hours > 0 ? $"{hours} hr" : $"{minutes} min";
        }

    }
}
