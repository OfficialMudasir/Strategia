using System.Collections.Generic;
using Strategia.Auditing.Dto;
using Strategia.Dto;

namespace Strategia.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
