
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SmartManagementDB')
BEGIN
    CREATE DATABASE SmartManagementDB;
END
GO

USE SmartManagementDB;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [EmailAddress] NVARCHAR(MAX) NOT NULL,
        [FirstName] NVARCHAR(MAX) NOT NULL,
        [LastName] NVARCHAR(MAX) NOT NULL,
        [Phone] NVARCHAR(10) NOT NULL,
        [EmployeeType] NVARCHAR(MAX) NOT NULL,
        [CompanyName] NVARCHAR(MAX) NOT NULL,
        [IsActive] BIT NOT NULL,
        [LastLogin] DATETIME2 NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END
GO
