INSERT INTO Common.LocalizationRecord
SELECT [Group] ='MobileUI',
                'Purchase.OrderProcess.Finished.Cancel' [Key] ,
                LocaleId ,
                CASE LocaleId
                  WHEN 282 THEN '' -- Turkish
                  WHEN 86 THEN 'Cancel' -- English
                  WHEN 59 THEN '' -- Dutch
                  WHEN 131 THEN ''
                  WHEN 108 THEN ''
                  ELSE ''
                  END ,
                GETUTCDATE() ,
                NULL ,
                0 ,
                NULL,
                NULL,
                NULL,
                NULL
FROM   Common.LocalizationRecord
WHERE  [Key] = 'AttributeDetail.Fields.BackToList' AND IsDeleted=0

--Eğer güncellemek istemediğiniz bir alan var ise onu WHEN THEN satırlarından siliniz
