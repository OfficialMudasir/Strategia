using System.Collections.Generic;
using Abp;
using Strategia.Chat.Dto;
using Strategia.Dto;

namespace Strategia.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
