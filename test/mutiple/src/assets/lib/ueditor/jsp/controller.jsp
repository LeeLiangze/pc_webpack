<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="com.ai.ecp.util.NewActionEnter"
    pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
	try{
	    request.setCharacterEncoding( "utf-8" );
		response.setHeader("Content-Type" , "text/html");
		request.setAttribute("action", "config");
		String rootPath = application.getRealPath( "/" );
		System.out.println(rootPath);
		out.write( new NewActionEnter( request, rootPath ).exec() );
	}catch(Exception e){
		out.write("系统异常");
	}
	
%>